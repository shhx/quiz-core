var models = require('../models')
var Sequelize = require('sequelize');
var cloudinary = require('cloudinary');
var fs = require('fs');

//Claudinary options
var cloudinary_image_options = { crop: 'limit', width: 200, height: 200, radius: 5, 
											border: "3px_solid_blue", tags: ['core', 'quiz-2016'] };

// Autoload :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId, {include: [models.Comment, models.Attachment]})
	.then(function(quiz){
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId' + quizId));
		}
	}).catch(function(error){
		next(error);
	});
};

exports.ownershipRequired = function (req, res, next) {
	var isAdmin = req.session.user.isAdmin;
	var quizAuthorId = req.quiz.AuthorId;
	var loggedUserId = req.session.user.id;

	if(isAdmin || quizAuthorId === loggedUserId){
		next();
	} else {
		console.log("Operacion prohibida: El ususario loggeado no es el autor del quiz, ni un admin");
		res.send(403);
	}
}

// GET /quizzes
exports.index = function(req, res, next) {
	var search = '';
	if(req.query.search)
		search = req.query.search.replace(/\s/g, '%');

	models.Quiz.findAll({
		include: [models.Attachment],
		where: {
			question: {$like: '%'+search+'%'}
		},
		order: [['question', 'ASC']]
	})
	.then(function(quizzes){
		if (req.params.format === "json") {
			res.json(quizzes);
			return;
		}
		res.render('quizzes/index.ejs', {quizzes: quizzes});
	})
	.catch(function(error){
		next(error);
	});
};

// GET /quizzes/:id
exports.show = function(req, res, next) {
	var answer = req.query.answer || '';
	if (req.params.format === "json") {
			res.json(req.quiz);
			return;
	}
	// Get users to show comments authors
	models.User.findAll()
	.then(function(users) {
		var userlist = {};
		for (var i = 0; i < users.length; i++) {
    		userlist[users[i].id] = users[i];
		}
		res.render('quizzes/show', {quiz: req.quiz, answer: answer, userlist: userlist});
	}) 
	.catch(function(error) { next(error);});
};

// GET /check
exports.check = function(req, res, next) {
	var answer = req.query.answer || "";
	var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
	res.render('quizzes/result', { quiz: req.quiz, result: result, answer: answer });
};

// GET /quizzes/new
exports.new = function(req, res, next) {
	var quiz = models.Quiz.build({question: "", answer: ""});
	res.render('quizzes/new', {quiz: quiz});
};

// POST /quizzes/create
exports.create = function(req, res, next) {
	var authorId = req.session.user && req.session.user.id || 0;
	var quiz = models.Quiz.build({ 
									question: req.body.question, 
									answer:   req.body.answer,
									AuthorId: authorId} );

	// guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["question", "answer", "AuthorId"]})
	.then(function(quiz) {
		req.flash('success', 'Quiz creado con exito');

		if (!req.file) {
			req.flash('info', 'Es un quiz sin imagen');
			return;
		}
		return uploadResourceToCloudinary(req)
		.then(function (uploadResult) {
			return createAttachment(req, uploadResult, quiz);
		});
	   
	})
	.then(function () {
		res.redirect('/quizzes');
	})
	.catch(Sequelize.ValidationError, function(error){
		req.flash('error', 'Errores en el formulario:');
		for (var i in error.errors) {
			req.flash('error', error.errors[i].value);
		}
		res.render('quizzes/new', {quiz: quiz});
	})
	.catch(function(error) {
		req.flash('error', 'Error al crear un Quiz: '+error.message);
		next(error);
	});  
};

// PUT /quizzes/:quizId
exports.update = function(req, res, next) {
	req.quiz.question = req.body.quiz.question;
	req.quiz.answer = req.body.quiz.answer;

	req.quiz.save({fields: ["question", "answer"]})
	.then(function(quiz) {
		req.flash('success', 'Quiz editado con exito');
	   if (req.file) {
			req.flash('info', 'Tenemos un Quiz sin imagen');
			if (quiz.Attachment) {
				cloudinary.api.delete_resources(quiz.Attachment.public_id);
				return quiz.Attachment.destroy();
			}
			return;
	   }
		return uploadResourceToCloudinary(req)
		.then(function (uploadResult) {
			return updateAttachment(req, uploadResult, quiz);
		});
	})
	.then(function () {
	   res.redirect('/quizzes');  // res.redirect: Redirección HTTP a lista de preguntas
	})
	.catch(Sequelize.ValidationError, function(error){
		req.flash('error', 'Errores en el formulario:');
		for (var i in error.errors) {
			req.flash('error', error.errors[i].value);
		}
		res.render('quizzes/edit', {quiz: req.quiz});
	})
	.catch(function(error) {
		req.flash('error', 'Error al editar un Quiz: '+error.message);
		next(error);
	});  
};

exports.edit = function(req, res, next){
	var quiz = req.quiz;
	res.render('quizzes/edit', {quiz: quiz});
};

//DELETE /quizzes/:quizId
exports.destroy = function(req, res, next){
	if (req.quiz.Attachment) {
		cloudinary.api.delete(req.quiz.Attachment.public_id);
	}

	req.quiz.destroy()
	.then(function(){
		req.flash('success', 'Quiz borrado con exito');
		res.redirect('/quizzes');
	})
	.catch(function(error){
		req.flash('error', 'Error al borrar el quiz'+error.message);
		next(error);
	});
};

function uploadResourceToCloudinary(req) {
	return new Promise(function(resolve, reject) {

	   cloudinary.uploader.upload(req.file.path, function(result) {
			fs.unlink(req.file.path); // delete image in ./uploads

			if (!result.error) {
			   resolve({ public_id: result.public_id,
			             url: result.secure_url,
			             // filename: req.file.originalname,
			             // mime: req.file.mimetype,
			            	 // QuizId: quiz.id 
			          	});
			} else {
			   req.flash('error', 'No se ha podido salvar la imagen: '+result.error.message);
			   resolve(null);
			}
		},
	   	cloudinary_image_options
	   );
	})
}

function createAttachment(req, uploadResult, quiz) {
	if (!uploadResult) {
		return Promise.resolve();
	}

	return models.Attachment.create({public_id: uploadResult.public_id,
			            					url: uploadResult.url,
			            					filename: req.file.originalname,
								            mime: req.file.mimetype,
								            QuizId: quiz.id})
	.then(function (attachment) {
		req.flash('success', 'Imagen nueva guardada con exito');
	})
	.catch(function (error) {
		req.flash('error', 'No se ha podido guardar la nueva imagen' + error.message);
		cloudinary.api.delete_resources(uploadResult.public_id);
	})
}

function updateAttachment(req, uploadResult, quiz) {
	if(!uploadResult){
		return Promise.resolve();
	}

	//old image public_id 
	var old_public_id = quiz.Attachment ? quiz.Attachment : null;

	return quiz.getAttachment()
	.then(function (attachment) {
		if (!attachment) {
			attachment = models.Attachment.build({QuizId: quiz.id});
		}
		attachment.public_id = uploadResult.public_id;
		attachment.url = uploadResult.url;
		attachment.filename = req.file.originalname;
		attachment.mime = req.file.mime;
		return attachment.save();
	})
	.then(function (attachment) {
		req.flash('success', 'Imagen nueva guardada con exito');
		if (old_public_id) {
			cloudinary.api.delete(old_public_id);
		}
	})
	.catch(function (error) {
		req.flash('error', 'No se ha podido salvar la nueva imagen' + error.message);
		cloudinary.api.delete(uploadResult.public_id);
	})
}
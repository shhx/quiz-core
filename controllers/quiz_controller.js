var models = require('../models')
var Sequelize = require('sequelize');

// Autoload :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId).then(function(quiz){
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

// GET /quizzes
exports.index = function(req, res, next) {
	search = '';
	if(req.query.search)
		search = req.query.search.replace(/\s/g, '%');
	models.Quiz.findAll({
		where: {
			question: {$like: '%'+search+'%'}
		},
		order: [['question', 'ASC']]
	})
	.then(function(quizzes){
		console.log(req.params);
		if (req.params.format === "json") {
			res.send(JSON.stringify(quizzes));
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
	console.log(answer);
	if (req.params.format === "json") {
			res.send(JSON.stringify(req.quiz));
			return;
		}
	res.render('quizzes/show', {quiz: req.quiz, answer: answer});
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
	var quiz = models.Quiz.build({ question: req.body.quiz.question, 
									answer:   req.body.quiz.answer} );

	// guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["question", "answer"]})
	.then(function(quiz) {
		req.flash('success', 'Quiz creado con exito');
	    res.redirect('/quizzes');  // res.redirect: Redirección HTTP a lista de preguntas
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
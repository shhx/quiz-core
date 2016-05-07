var models = require('../models')


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
		console.log('Resultado: '+quizzes);
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
    	res.redirect('/quizzes');  // res.redirect: Redirección HTTP a lista de preguntas
    })
.catch(function(error) {
	next(error);
});  
};
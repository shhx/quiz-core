var models = require('../models')

// GET /quizzes
exports.index = function(req, res, next) {

	models.Quiz.findAll().then(function(quizzes){
		res.render('quizzes/index.ejs', {quizzes: quizzes});
	})
	.catch(function(error){
		next(error);
	});
};

// GET /quizzes/:id
exports.show = function(req, res, next) {

	models.Quiz.findById(req.params.quizId).then(function(quiz){
			console.log(req.params.quizId);
		if (quiz) {
			var answer = req.query.answer || '';
			res.render('quizzes/show', {quiz: quiz, answer: quiz.answer});
		} else {
			throw new Error('No existe ese quiz en la BBDD.');
		}
	})
	.catch(function(error){
		next(error)
	});
};

// GET /check
exports.check = function(req, res, next) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		if (quiz) {
			var answer = req.query.answer || "";
			var result = answer === quiz.answer ? 'Correcta' : 'Incorrecta';
			res.render('quizzes/result', { quiz: quiz, result: result, answer: answer });
		} else {
			throw new Error('No existe ese quiz en la BBDD.');
		}
	})
	.catch(function(error) {
		next(error)
	});
};
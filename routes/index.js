var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
//Home page
router.get('/', function(req, res, next) {
  res.render('index');
});

// autoload :quizId
router.param('quizId', quizController.load); 

//Question pages
router.get('/quizzes', 							quizController.index);
router.get('/quizzes/:quizId(\\d+)', 		quizController.show);
router.get('/quizzes/:quizId(\\d+)/check',quizController.check);
router.get('/quizzes/new',						quizController.new);
router.post('/quizzes',							quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizzes/:quizId(\\d+)',		quizController.update);
router.delete('/quizzes/:quizId(\\d+)',	quizController.destroy);
	
// Author page
router.get('/author', function (req, res, next) {
	res.render('author', {author: {name: 'Luis Alberto Gómez López', photo: "images/mia.jpg"}});
});

module.exports = router;

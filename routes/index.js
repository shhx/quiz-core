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
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);


// Author page
router.get('/author', function (req, res, next) {
	res.render('author', {author: {name: 'Luis Alberto Gómez López', photo: "images/mia.jpg"}});
});

module.exports = router;

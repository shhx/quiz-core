var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
//Home page
router.get('/', function(req, res, next) {
  res.render('index');
});

//Question pages
router.get('/question', quizController.question);
router.get('/check', quizController.check);

// Author page
router.get('/author', function (req, res, next) {
	res.render('author', { title: 'Página de autor' , author: {name: 'Luis Alberto Gomez Lopez', photo: "public/mia.jpg"}});
});

module.exports = router;

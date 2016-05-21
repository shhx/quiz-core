var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller.js');
var userController = require('../controllers/user_controller.js');


//Home page
router.get('/', function(req, res, next) {
  res.render('index');
});

// autoloads
router.param('quizId', quizController.load); 
router.param('userId', userController.load); 

//Question pages
router.get('/quizzes.:format?', 					quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?', 		quizController.show);
router.get('/quizzes/:quizId(\\d+)/check',			quizController.check);
router.get('/quizzes/new',							quizController.new);
router.post('/quizzes',								quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit', 			quizController.edit);
router.put('/quizzes/:quizId(\\d+)',				quizController.update);
router.delete('/quizzes/:quizId(\\d+)',				quizController.destroy);

//Comment pages
router.get('/quizzes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments', commentController.create);

//User pages
router.get('/users', 								userController.index);
router.get('/users/:userId(\\d+)', 					userController.show);
router.get('/users/new',							userController.new);
router.post('/users', 								userController.create);
router.get('/users/:userId(\\d+)/edit', 			userController.edit);
router.put('/users/:userId(\\d+)', 					userController.update);
router.delete('/users/:userId(\\d+)', 				userController.destroy);

// Author page
router.get('/author', function (req, res, next) {
	res.render('author', {author: {name: 'Luis Alberto Gómez López', photo: "images/mia.jpg"}});
});

module.exports = router;

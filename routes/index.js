var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller.js');
var userController = require('../controllers/user_controller.js');
var sessionController = require('../controllers/session_controller.js');

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
router.get('/quizzes/new',							sessionController.loginRequired, quizController.new);
router.post('/quizzes',								sessionController.loginRequired, quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit', 			sessionController.loginRequired, quizController.edit);
router.put('/quizzes/:quizId(\\d+)',				sessionController.loginRequired, quizController.update);
router.delete('/quizzes/:quizId(\\d+)',				sessionController.loginRequired, quizController.destroy);

//Comment pages
router.get('/quizzes/:quizId(\\d+)/comments/new', 	sessionController.loginRequired, commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments', 		sessionController.loginRequired, commentController.create);

//User pages
router.get('/users', 								userController.index); //user list
router.get('/users/:userId(\\d+)', 					userController.show);
router.get('/users/new',							userController.new);
router.post('/users', 								userController.create);
router.get('/users/:userId(\\d+)/edit', 			sessionController.loginRequired, userController.edit);
router.put('/users/:userId(\\d+)', 					sessionController.loginRequired, userController.update);
router.delete('/users/:userId(\\d+)', 				sessionController.loginRequired, userController.destroy);

//Session routes
router.get('/session', sessionController.new); //login form
router.post('/session', sessionController.create);
router.delete('/session', sessionController.destroy);

// Author page
router.get('/author', function (req, res, next) {
	res.render('author', {author: {name: 'Luis Alberto Gómez López', photo: "images/mia.jpg"}});
});

module.exports = router;

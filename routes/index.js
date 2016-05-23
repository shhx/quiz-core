var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads/'});

var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller.js');
var userController = require('../controllers/user_controller.js');
var sessionController = require('../controllers/session_controller.js');

//Home page
router.get('/', function(req, res, next) {
  res.render('index');
});

// autoloads
router.param('quizId', 		quizController.load); 
router.param('userId', 		userController.load); 
router.param('commentId',	commentController.load); 

//Question pages
router.get('/quizzes.:format?', 					quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?', 		quizController.show);
router.get('/quizzes/:quizId(\\d+)/check',			quizController.check);
router.get('/quizzes/new',							sessionController.loginRequired, quizController.new);
router.post('/quizzes',								sessionController.loginRequired, 
													upload.single('image'),
													quizController.create);

router.get('/quizzes/:quizId(\\d+)/edit', 			sessionController.loginRequired, 
													quizController.ownershipRequired,
													quizController.edit);

router.put('/quizzes/:quizId(\\d+)',				sessionController.loginRequired, 
													quizController.ownershipRequired,
													upload.single('image'),
													quizController.update);

router.delete('/quizzes/:quizId(\\d+)',				sessionController.loginRequired,
													quizController.ownershipRequired,
													quizController.destroy);

//Comment pages
router.get('/quizzes/:quizId(\\d+)/comments/new', 	sessionController.loginRequired, commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments', 		sessionController.loginRequired, commentController.create);
router.put('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/accept', 		sessionController.loginRequired, 
																			quizController.ownershipRequired,
																			commentController.accept);

//User pages
router.get('/users', 								userController.index); //user list
router.get('/users/:userId(\\d+)', 					userController.show);
router.get('/users/new',							userController.new);
router.post('/users', 								userController.create);

router.get('/users/:userId(\\d+)/edit', 			sessionController.loginRequired, 
													userController.adminOrMyselfRequired,
													userController.edit);

router.put('/users/:userId(\\d+)', 					sessionController.loginRequired,
													userController.adminOrMyselfRequired,
													userController.update);

router.delete('/users/:userId(\\d+)', 				sessionController.loginRequired, 
													userController.adminAndNotMyselfRequired,
													userController.destroy);

//Session routes
router.get('/session', sessionController.new); //login form
router.post('/session', sessionController.create);
router.delete('/session', sessionController.destroy);

// Author page
router.get('/author', function (req, res, next) {
	res.render('author', {author: {name: 'Luis Alberto Gómez López', photo: "images/mia.jpg"}});
});

module.exports = router;

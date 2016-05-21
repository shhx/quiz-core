
var url = require('url');
var models = require('../models');

// GET /session   Login form
exports.new = function(req, res, next) {
	var redir = req.query.redir || url.parse(req.headers.referer || "/").pathname;
	if (redir === '/session' || redir === '/users/new') {
		redir = "/";
	}
	res.render('session/new', {redir : redir});
};


// POST /session   Crear la sesion 
exports.create = function(req, res, next) {

	var redir = req.body.redir || "/";

	var login     = req.body.login;
	var password  = req.body.password;

	authenticate(login, password)
	.then(function(user) {
		req.session.user = {id:user.id, username:user.username};
		res.redirect("/"); // redirección a la raiz
	})
	.catch(function(error) {
		req.flash('error', 'Se ha producido un error: ' + error);
		next(error);  
	});
};


// DELETE /session 
exports.destroy = function(req, res, next) {
	delete req.session.user;
	res.redirect("/session"); // redirect a login
};

var authenticate = function (login, password) {
	return models.User.findOne({where: {username: login}})
		.then(function(user){
			return (user && user.verifyPassword(password)) ? user:null;
	});
};
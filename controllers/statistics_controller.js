var models = require('../models');

exports.statistics = function (req, res) {
	models.Quiz.findAll({ include: [{ model: models.Comment }] })
	.then(function (quizzes) {
		models.User.findAll().then(function (users) {
			var stats = {
				totalQuizzes: quizzes.length,
				totalComments: 0,
				totalUsers: users.length,
				quizzesWithComments: 0,
				quizzesWithoutComments: 0
			};
			for (var i = 0; i < quizzes.length; i++) {
				console.log(quizzes[i]);
				if (quizzes[i].Comments.length === 0) {
					stats.quizzesWithoutComments++;
					continue;
				}
				for (var j = 0; i < quizzes[i].Comments.length; i++) {
					stats.totalComments++;
				}
				stats.quizzesWithComments++;
			}
			res.render('quizzes/statistics', {stats: stats});
		});
	});
};

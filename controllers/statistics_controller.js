exports.statistics = function (req, res, next) {
	// models.Quiz.findAll({ include: [{ model: models.Comment }] }).then(function (quizes) {
	// 	models.User.findAll().then(function (users) {
	// 		var findLeaderBoard = function (userArr, callback) {
	// 			var countSolutions = function (user, callback) {
	// 				user.getSolutions().then(function (solutions) {
	// 					callback(user, solutions.length);
	// 				});
	// 			}
	// 			var leaderBoard = [];
	// 			var finished = 0;
	// 			if (userArr.length > 0) {
	// 				for (var i = 0; i < userArr.length; i++) {
	// 					countSolutions(userArr[i], function (user, count) {
	// 						leaderBoard.push({ username: user.username, count: count });
	// 						finished++;
	// 						if (finished === userArr.length) {
	// 							leaderBoard.sort(function (a, b) {
	// 								return b.count - a.count;
	// 							});
	// 							callback(leaderBoard);
	// 						}
	// 					});
	// 				}
	// 			}
	// 			else {
	// 				callback(leaderBoard);
	// 			}
	// 		}

	// 		findLeaderBoard(users, function (leaderBoard) {
	// 			console.log(leaderBoard);
	// 			var statistics = {
	// 				totalQuizes: quizes.length,
	// 				totalComments: 0,
	// 				quizesWithComments: 0,
	// 				quizesWithoutComments: 0,
	// 				medianComments: 0
	// 			};
	// 			for (var i = 0; i < quizes.length; i++) {
	// 				if (!quizes[i].Comments || quizes[i].Comments.length === 0) {
	// 					statistics.quizesWithoutComments++;
	// 					continue;
	// 				}
	// 				for (var j = 0; j < quizes[i].Comments.length; j++) {
	// 					statistics.totalComments++;
	// 				}
	// 				statistics.quizesWithComments++;
	// 			}
	// 			statistics.medianComments = statistics.totalComments / statistics.totalQuizes;
	res.render('quizzes/statistics');
	// 		});
	// 	});
	// });
};

'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var examsessions = require('../../app/controllers/examsessions.server.controller');

	var canview = ['admin', 'manager'];
	var canedit = ['admin'];

	// Exam sessions routes
	app.route('/examsessions')
		.get(users.hasAuthorization(canview), examsessions.list)
		.post(users.hasAuthorization(canedit), examsessions.create);

	app.route('/examsessions/:examSessionId')
		.get(users.hasAuthorization(canview), examsessions.read)
		.put(users.hasAuthorization(canedit), examsessions.update)
		.delete(users.hasAuthorization(canedit), examsessions.delete);

	// Finish by binding the exam session middleware
	app.param('examSessionId', examsessions.examSessionByID);
};

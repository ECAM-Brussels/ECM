'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var examsessions = require('../../app/controllers/examsessions.server.controller');

	// Exam sessions routes
	app.route('/examsessions')
		.get(users.hasAuthorization(['admin']), examsessions.list)
		.post(users.hasAuthorization(['admin']), examsessions.create);

	app.route('/examsessions/:examSessionId')
		.get(users.hasAuthorization(['admin']), examsessions.read)
		.put(users.hasAuthorization(['admin']), examsessions.update)
		.delete(users.hasAuthorization(['admin']), examsessions.delete);

	// Finish by binding the exam session middleware
	app.param('examSessionId', examsessions.examSessionByID);
};

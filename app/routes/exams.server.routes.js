'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var exams = require('../../app/controllers/exams.server.controller');

	// Exams Routes
	app.route('/exams')
		.get(exams.list)
		.post(users.requiresLogin, exams.create);

	app.route('/exams/:examId')
		.get(exams.read)
		.put(users.requiresLogin, exams.hasAuthorization, exams.update)
		.delete(users.requiresLogin, exams.hasAuthorization, exams.delete);

	// Finish by binding the Exam middleware
	app.param('examId', exams.examByID);
};

'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var exams = require('../../app/controllers/exams.server.controller');
  var authorized = ['teacher', 'admin', 'manager', 'printer'];

	// Exams Routes
	app.route('/exams')
		.get(users.requiresLogin, users.hasAuthorization(authorized), exams.list)
		.post(users.requiresLogin, users.hasAuthorization(authorized), exams.create);

	app.route('/exams/:examId')
		.get(users.requiresLogin, users.hasAuthorization(authorized), exams.read)
		.put(users.requiresLogin, users.hasAuthorization(authorized), exams.update)
		.delete(users.requiresLogin, users.hasAuthorization(authorized), exams.delete);

	// Finish by binding the Exam middleware
	app.param('examId', exams.examByID);
};

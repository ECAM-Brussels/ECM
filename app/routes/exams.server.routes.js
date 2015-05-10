'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var exams = require('../../app/controllers/exams.server.controller');

	var authorized = ['teacher', 'admin', 'manager', 'printer'];

	// Exams routes
	app.route('/exams')
		.get(users.requiresLogin, users.hasAuthorization(authorized), exams.list)
		.post(users.requiresLogin, users.hasAuthorization(authorized), exams.create);

	app.route('/exams/:examId')
		.get(users.requiresLogin, users.hasAuthorization(authorized), exams.read)
		.put(users.requiresLogin, users.hasAuthorization(authorized), exams.update)
		.delete(users.requiresLogin, users.hasAuthorization(authorized), exams.delete);

	// Copies routes
	app.route('/copies')
		.post(users.requiresLogin, users.hasAuthorization(authorized), exams.createCopy);

	// Finish by binding the exam middleware
	app.param('examId', exams.examByID);
};

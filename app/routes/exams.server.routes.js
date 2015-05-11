'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var exams = require('../../app/controllers/exams.server.controller');
	var multiparty = require('connect-multiparty');

	var canview = ['admin', 'manager', 'teacher', 'printer'];
	var canedit = ['admin'];

	// Exams routes
	app.route('/exams')
		.get(users.requiresLogin, users.hasAuthorization(canview), exams.list)
		.post(users.requiresLogin, users.hasAuthorization(canedit), exams.create);

	app.route('/exams/:examId')
		.get(users.requiresLogin, users.hasAuthorization(canview), exams.read)
		.put(users.requiresLogin, users.hasAuthorization(canedit), exams.update)
		.delete(users.requiresLogin, users.hasAuthorization(canedit), exams.delete);

	// Copies routes
	app.route('/copies')
		.post(users.requiresLogin, users.hasAuthorization(canedit), exams.createCopy);

	app.route('/upload/copy')
		.post(users.requiresLogin, users.hasAuthorization(canedit), multiparty(), exams.uploadCopy);

	// Finish by binding the exam middleware
	app.param('examId', exams.examByID);
};

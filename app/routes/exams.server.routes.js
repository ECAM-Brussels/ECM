'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var exams = require('../../app/controllers/exams.server.controller');
	var multiparty = require('connect-multiparty');

	var canview = ['admin', 'manager', 'teacher', 'printer'];
	var canedit = ['admin'];

	// Exams routes
	app.route('/exams')
		.get(users.hasAuthorization(canview), exams.list)
		.post(users.hasAuthorization(canedit), exams.create);

	app.route('/list/myExams')
		.get(users.hasAuthorization(['teacher']), exams.listMyExams);

	app.route('/exams/:examId')
		.get(users.hasAuthorization(canview), exams.read)
		.put(users.hasAuthorization(['admin', 'teacher', 'printer']), exams.update)
		.delete(users.hasAuthorization(canedit), exams.delete);

	// Copies routes
	app.route('/copies')
		.post(users.hasAuthorization(['teacher']), exams.createCopy);
	app.route('/copies/validate')
		.post(users.hasAuthorization(['teacher']), exams.validateCopy);

	app.route('/upload/copy')
		.post(users.hasAuthorization(['admin', 'teacher']), multiparty(), exams.uploadCopy);

	app.route('/download/copy')
		.post(users.hasAuthorization(['admin', 'teacher', 'printer']), exams.downloadCopy);
	app.route('/download/copies')
		.post(users.hasAuthorization(['admin', 'printer']), exams.downloadCopies);

	// Finish by binding the exam middleware
	app.param('examId', exams.examByID);
};

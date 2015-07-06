'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var courses = require('../../app/controllers/courses.server.controller');

	var canview = ['admin', 'manager', 'printer'];
	var canedit = ['admin'];

	// Courses routes
	app.route('/courses')
		.get(users.hasAuthorization(canview), courses.list)
		.post(users.hasAuthorization(canedit), courses.create);

	app.route('/list/myCourses')
		.get(users.hasAuthorization(['teacher']), courses.listMyCourses);

	app.route('/courses/:courseId')
		.get(users.hasAuthorization(['manager', 'admin', 'teacher']), courses.read)
		.post(users.hasAuthorization(canedit), courses.create)
		.put(users.hasAuthorization(canedit), courses.update)
		.delete(users.hasAuthorization(canedit), courses.delete);

	// Finish by binding the course middleware
	app.param('courseId', courses.courseByID);
};

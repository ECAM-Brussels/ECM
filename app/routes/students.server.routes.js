'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var students = require('../../app/controllers/students.server.controller');
	var authorized = ['admin', 'manager'];

	// Students Routes
	app.route('/students')
		.get(users.hasAuthorization(authorized), students.list)
		.post(users.hasAuthorization(authorized), students.create);

	app.route('/students/:studentId')
		.post(users.hasAuthorization(authorized), students.create)
		.get(users.hasAuthorization(authorized), students.read)
		.put(users.hasAuthorization(authorized), students.update)
		.delete(users.hasAuthorization(authorized), students.delete);

	app.route('/import/students')
		.post(users.hasAuthorization(['admin']), students.importStudents);

	// Finish by binding the Student middleware
	app.param('studentId', students.studentByID);
};

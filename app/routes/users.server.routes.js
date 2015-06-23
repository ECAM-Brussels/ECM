'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');

	// Setting up the users password api
	app.route('/users/password')
		.post(users.changePassword);

	// Setting up the users profile api
	app.route('/users/me')
		.get(users.me);
	app.route('/users')
		.get(users.hasAuthorization(['admin', 'manager']), users.find)
		.post(users.hasAuthorization(['admin', 'manager']), users.createUser);

	app.route('/users/:userId')
		.get(users.hasAuthorization(['admin', 'manager', 'teacher']), users.hasTeacherAuthorization(), users.read)
		.post(users.hasAuthorization(['admin', 'manager']), users.createUser)
		.put(users.hasAuthorization(['admin', 'manager', 'teacher'], users.hasTeacherAuthorization()), users.update)
		.delete(users.hasAuthorization(['admin', 'manager']), users.delete);

	app.route('/auth/forgot')
		.post(users.forgot);
	app.route('/auth/reset/:token')
		.get(users.validateResetToken);
	app.route('/auth/reset/:token')
		.post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signin')
		.post(users.signin);
	app.route('/auth/signout')
		.get(users.signout);

	// Finish by binding the user middleware
	app.param('userId', users.userBySerial);
};

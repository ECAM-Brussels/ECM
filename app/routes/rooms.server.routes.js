'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var rooms = require('../../app/controllers/rooms.server.controller');
  var authorized = ['admin', 'manager'];

	// Rooms Routes
	app.route('/rooms')
		.get(users.requiresLogin, users.hasAuthorization(authorized), rooms.list)
		.post(users.requiresLogin, users.hasAuthorization(authorized), rooms.create);

	app.route('/rooms/:roomId')
    .post(users.requiresLogin, users.hasAuthorization(authorized), rooms.create)
		.get(users.requiresLogin, users.hasAuthorization(authorized), rooms.read)
		.put(users.requiresLogin, users.hasAuthorization(authorized), rooms.update)
		.delete(users.requiresLogin, users.hasAuthorization(authorized), rooms.delete);

	// Finish by binding the Room middleware
	app.param('roomId', rooms.roomByID);
};

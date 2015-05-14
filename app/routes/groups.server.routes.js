'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var groups = require('../../app/controllers/groups.server.controller');
	var authorized = ['admin'];
	
	// Groups routes
	app.route('/groups')
		.get(users.hasAuthorization(authorized), groups.list)
		.post(users.hasAuthorization(authorized), groups.create);

	app.route('/groups/:groupId')
		.post(users.hasAuthorization(authorized), groups.create)
		.get(users.hasAuthorization(authorized), groups.read)
		.put(users.hasAuthorization(authorized), groups.update)
		.delete(users.hasAuthorization(authorized), groups.delete);

	// Finish by binding the Group middleware
	app.param('groupId', groups.groupByName);
};

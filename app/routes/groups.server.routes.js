'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var groups = require('../../app/controllers/groups.server.controller');

	// Groups routes
	app.route('/groups')
	   .get(users.requiresLogin, users.hasAuthorization(['admin', 'manager']), groups.list);
};

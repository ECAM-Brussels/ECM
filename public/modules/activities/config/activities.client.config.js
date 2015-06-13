'use strict';

// Configuring the activities module
angular.module('activities').run(['Menus', function (Menus) {
	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'Activities', 'activities', 'activities', false, ['admin']);

	// Set top bar menu items
//	Menus.addMenuItem('topbar', 'Activities', 'activities', 'dropdown', '/activities(/create)?', false, ['admin']);
//	Menus.addSubMenuItem('topbar', 'activities', 'Create', 'activities/create', 'activities/create', false, ['admin']);
}]);

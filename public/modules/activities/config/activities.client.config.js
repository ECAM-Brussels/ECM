'use strict';

// Configuring the activities module
angular.module('activities').run(['Menus', function (Menus) {
	// Set top bar menu items
    Menus.addMenuItem('topbar', 'Activities', 'activities', 'dropdown', '/activities(/create)?', false, ['admin', 'manager']);
	Menus.addSubMenuItem('topbar', 'activities', 'List', 'activities', 'activities', false, ['admin', 'manager']);
    Menus.addSubMenuItem('topbar', 'activities', 'Create', 'activities/create', 'activities/create', false, ['admin']);
}]);

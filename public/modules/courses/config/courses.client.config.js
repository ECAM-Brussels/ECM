'use strict';

// Configuring the Articles module
angular.module('courses').run(['Menus', function(Menus) {
	// Set dashboard menu items
	Menus.addSubMenuItem('topbar', 'dashboard', 'My courses', 'list/myCourses', 'list/myCourses', false, ['teacher']);

	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'Courses', 'courses', 'courses', false, ['admin']);

	// Set top bar menu items
//	Menus.addMenuItem('topbar', 'Courses', 'courses', 'dropdown', '/courses(/create)?', false, ['admin']);
//	Menus.addSubMenuItem('topbar', 'courses', 'Create', 'courses/create', 'courses/create', false, ['admin']);
}]);

'use strict';

// Configuring the Articles module
angular.module('courses').run(['Menus', function(Menus) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'Courses', 'courses', 'dropdown', '/courses(/create)?', false, ['admin', 'manager', 'teacher']);
	Menus.addSubMenuItem('topbar', 'courses', 'List', 'courses', 'courses', false, ['admin', 'manager']);
	Menus.addSubMenuItem('topbar', 'courses', 'Create', 'courses/create', 'courses/create', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'courses', 'My courses', 'list/myCourses', 'list/myCourses', false, ['teacher']);
}]);

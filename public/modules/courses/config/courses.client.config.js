'use strict';

// Configuring the Articles module
angular.module('courses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Courses', 'courses', 'dropdown', '/courses(/create)?', false, ['admin', 'manager', 'teacher']);
		Menus.addSubMenuItem('topbar', 'courses', 'List Courses', 'courses', false, ['admin', 'manager']);
		Menus.addSubMenuItem('topbar', 'courses', 'New Course', 'courses/create', false, ['admin', 'manager']);
    Menus.addSubMenuItem('topbar', 'courses', 'My Courses', 'list/myCourses', false, ['teacher']);
	}
]);

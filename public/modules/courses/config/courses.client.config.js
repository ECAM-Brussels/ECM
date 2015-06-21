'use strict';

// Set up the menu for the courses module
angular.module('courses').run(['Menus', function(Menus) {
	// Set dashboard menu items
	Menus.addSubMenuItem('topbar', 'dashboard', 'MENU.MY_COURSES', 'list/myCourses', 'list/myCourses', false, ['teacher']);

	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'Courses', 'courses', 'courses', false, ['admin']);
}]);

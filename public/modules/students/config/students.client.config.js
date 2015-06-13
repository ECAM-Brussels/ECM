'use strict';

// Configuring the students module
angular.module('students').run(['Menus', function(Menus) {
	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'Students', 'students', 'students', false, ['admin']);

	// Set top bar menu items
//	Menus.addMenuItem('topbar', 'Students', 'students', 'dropdown', '/students(/create)?', false, ['admin']);
//	Menus.addSubMenuItem('topbar', 'students', 'Create', 'students/create', 'students/create', false, ['admin']);
//	Menus.addSubMenuItem('topbar', 'students', 'Groups', 'groups', 'groups', false, ['admin']);
//	Menus.addSubMenuItem('topbar', 'students', 'Import from CSV', 'import/students/fromCSV', 'import/students/fromCSV', false, ['admin']);
}]);

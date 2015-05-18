'use strict';

// Configuring the students module
angular.module('students').run(['Menus', function(Menus) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'Students', 'students', 'dropdown', '/students(/create)?', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'students', 'List', 'students', 'students', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'students', 'Create', 'students/create', 'students/create', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'students', 'Groups', 'groups', 'groups', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'students', 'Import from CSV', 'import/students/fromCSV', 'import/students/fromCSV', false, ['admin']);
}]);

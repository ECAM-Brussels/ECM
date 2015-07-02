'use strict';

// Set up the menu for the students module
angular.module('students').run(['Menus', function(Menus) {
	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'MENU.STUDENTS', 'students', 'students', false, ['admin']);

	// Set tools menu items
	Menus.addSubMenuItem('topbar', 'tools', 'MENU.IMPORT_STUDENTS', 'import/students/fromCSV', 'import/students/fromCSV', false, ['admin']);
}]);

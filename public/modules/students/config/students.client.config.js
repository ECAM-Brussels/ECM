'use strict';

// Set up the menu for the students module
angular.module('students').run(['Menus', function(Menus) {
	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'Students', 'students', 'students', false, ['admin']);

	// Set tools menu items
	Menus.addSubMenuItem('topbar', 'tools', 'Import students', 'import/students/fromCSV', 'import/students/fromCSV', false, ['admin']);
}]);

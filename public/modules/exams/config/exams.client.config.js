'use strict';

// Set up the menu for the exams module
angular.module('exams').run(['Menus', function(Menus) {
	// Set dashboard menu items
	Menus.addSubMenuItem('topbar', 'dashboard', 'MENU.MY_EXAMS', 'list/myExams', 'list/myExams', false, ['teacher']);

	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'MENU.EXAMS', 'exams', 'exams', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'manage', 'MENU.EXAMS', 'manage/exams', 'manage/exams', false, ['manager']);
	Menus.addSubMenuItem('topbar', 'manage', 'MENU.EXAMS', 'print/exams', 'print/exams', false, ['printer']);
}]);

'use strict';

// Configuring the exam module
angular.module( 'exams' ).run(['Menus', function(Menus) {
	// Set dashboard menu items
	Menus.addSubMenuItem('topbar', 'dashboard', 'My exams', 'list/myExams', 'list/myExams', false, ['teacher']);

	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'Exams', 'exams', 'exams', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'manage', 'Exams', 'manage/exams', 'manage/exams', false, ['manager']);
	Menus.addSubMenuItem('topbar', 'manage', 'Exams', 'print/exams', 'print/exams', false, ['printer']);

	// Set top bar menu items
//	Menus.addMenuItem('topbar', 'Exams', 'exams', 'dropdown', '/exams(/create)?', false, ['admin']);
//	Menus.addSubMenuItem('topbar', 'exams', 'Create', 'exams/create', 'exams/create', false, ['admin']);
}]);

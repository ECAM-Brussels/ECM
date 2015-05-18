'use strict';

// Configuring the exam module
angular.module( 'exams' ).run(['Menus', function(Menus) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'Exams', 'exams', 'dropdown', '/exams(/create)?', false, ['admin', 'manager', 'teacher', 'printer']);
	Menus.addSubMenuItem('topbar', 'exams', 'List', 'exams', 'exams', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'exams', 'Create', 'exams/create', 'exams/create', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'exams', 'My exams', 'list/myExams', 'list/myExams', false, ['teacher']);
	Menus.addSubMenuItem('topbar', 'exams', 'List', 'print/exams', 'print/exams', false, ['printer']);
	Menus.addSubMenuItem('topbar', 'exams', 'List', 'manage/exams', 'manage/exams', false, ['manager']);
}]);

'use strict';

// Configuring the Articles module
angular.module( 'exams' ).run(['Menus', function(Menus) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'Exams', 'exams', 'dropdown', '/exams(/create)?', false, ['admin', 'manager', 'teacher', 'printer']);
	Menus.addSubMenuItem('topbar', 'exams', 'List', 'exams', 'exams', false, ['admin', 'manager', 'printer']);
	Menus.addSubMenuItem('topbar', 'exams', 'Create', 'exams/create', 'exams/create', false, ['admin']);
	Menus.addSubMenuItem('topbar', 'exams', 'My exams', 'list/myExams', 'list/myExams', false, ['teacher']);
}]);

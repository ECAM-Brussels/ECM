'use strict';

// Configuring the Articles module
angular.module('exams').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Exams', 'exams', 'dropdown', '/exams(/create)?');
		Menus.addSubMenuItem('topbar', 'exams', 'List Exams', 'exams');
		Menus.addSubMenuItem('topbar', 'exams', 'New Exam', 'exams/create');
	}
]);
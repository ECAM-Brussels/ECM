'use strict';

// Setting up route
angular.module('students').config(['$stateProvider', function($stateProvider) {
	// Students state routing
	$stateProvider
	.state('listStudents', {
		url: '/students',
		templateUrl: 'modules/students/views/list-students.client.view.html'
	})
	.state('createStudent', {
		url: '/students/create',
		templateUrl: 'modules/students/views/create-student.client.view.html'
	})
	.state('viewStudent', {
		url: '/students/:studentId',
		templateUrl: 'modules/students/views/view-student.client.view.html'
	})
	.state('importStudents', {
		url: '/import/students/fromCSV',
		templateUrl: 'modules/students/views/import-students-from-csv.client.view.html'
	})
	.state('editStudent', {
		url: '/students/:studentId/edit',
		templateUrl: 'modules/students/views/edit-student.client.view.html'
	})
	.state('manageGroups', {
		url: '/groups',
		templateUrl: 'modules/students/views/list-groups.client.view.html'
	});
}]);

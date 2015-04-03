'use strict';

//Setting up route
angular.module('exams').config(['$stateProvider',
	function($stateProvider) {
		// Exams state routing
		$stateProvider.
		state('listExams', {
			url: '/exams',
			templateUrl: 'modules/exams/views/list-exams.client.view.html'
		}).
		state('createExam', {
			url: '/exams/create',
			templateUrl: 'modules/exams/views/create-exam.client.view.html'
		}).
		state('viewExam', {
			url: '/exams/:examId',
			templateUrl: 'modules/exams/views/view-exam.client.view.html'
		}).
		state('editExam', {
			url: '/exams/:examId/edit',
			templateUrl: 'modules/exams/views/edit-exam.client.view.html'
		});
	}
]);
'use strict';

//Setting up route
angular.module('exams').config(['$stateProvider', function($stateProvider) {
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
	})
	.state('listMyExam', {
		url: '/list/myExams',
		templateUrl: 'modules/exams/views/list-my-exams.client.view.html'
	})
	.state('printExams', {
		url: '/print/exams',
		templateUrl: 'modules/exams/views/print-exams.client.view.html'
	})
	.state('viewPrintExams', {
		url: '/print/exams/:examId',
		templateUrl: 'modules/exams/views/view-print-exam.client.view.html'
	})
	.state('manageExams', {
		url: '/manage/exams',
		templateUrl: 'modules/exams/views/manage-exams.client.view.html'
	})
	.state('viewManageExams', {
		url: '/manage/exams/:examId',
		templateUrl: 'modules/exams/views/view-manage-exam.client.view.html'
	})
	.state('editExam', {
		url: '/exams/:examId/edit',
		templateUrl: 'modules/exams/views/edit-exam.client.view.html'
	});
}]);

angular.module('exams').config(['$compileProvider', function($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^data:text\/csv;.*/);
}]);

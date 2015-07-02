'use strict';

//Setting up route
angular.module('examsessions').config(['$stateProvider', function($stateProvider) {
		// Exam sessions state routing
		$stateProvider
		.state('listExamSessions', {
			url: '/examsessions',
			templateUrl: 'modules/examsessions/views/list-examsessions.client.view.html'
		})
		.state('createExamSession', {
			url: '/examsessions/create',
			templateUrl: 'modules/examsessions/views/create-examsession.client.view.html'
		})
		.state('viewExamSession', {
			url: '/examsessions/:examSessionId',
			templateUrl: 'modules/examsessions/views/view-examsession.client.view.html'
		})
		.state('editExamSession', {
			url: '/examsessions/:examSessionId/edit',
			templateUrl: 'modules/examsessions/views/edit-examsession.client.view.html'
		});
	}
]);

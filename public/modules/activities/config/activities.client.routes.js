'use strict';

//Setting up route
angular.module('activities').config(['$stateProvider',
	function($stateProvider) {
		// Activities state routing
		$stateProvider.
		state('listActivities', {
			url: '/activities',
			templateUrl: 'modules/activities/views/list-activities.client.view.html'
		}).
		state('createActivity', {
			url: '/activities/create',
			templateUrl: 'modules/activities/views/create-activity.client.view.html'
		}).
		state('viewActivity', {
			url: '/activities/:activityId',
			templateUrl: 'modules/activities/views/view-activity.client.view.html'
		}).
		state('editActivity', {
			url: '/activities/:activityId/edit',
			templateUrl: 'modules/activities/views/edit-activity.client.view.html'
		});
	}
]);
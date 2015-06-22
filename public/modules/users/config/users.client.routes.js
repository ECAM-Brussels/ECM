'use strict';

// Setting up route
angular.module('users').config(['$stateProvider', function($stateProvider) {
	// Users state routing
	$stateProvider
	.state('profile', {
		url: '/settings/profile',
		templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
	})
	.state('password', {
		url: '/settings/password',
		templateUrl: 'modules/users/views/settings/change-password.client.view.html'
	})
	.state('signin', {
		url: '/signin',
		templateUrl: 'modules/users/views/authentication/signin.client.view.html'
	})
	.state('forgot', {
		url: '/password/forgot',
		templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
	})
	.state('reset-invalid', {
		url: '/password/reset/invalid',
		templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
	})
	.state('reset-success', {
		url: '/password/reset/success',
		templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
	})
	.state('list-users', {
		url: '/users',
		templateUrl: 'modules/users/views/list-users.client.view.html'
	})
	.state('create-user', {
		url: '/users/create',
		templateUrl: 'modules/users/views/create-user.client.view.html'
	})
	.state('view-user', {
		url: '/users/:serial',
		templateUrl: 'modules/users/views/view-user.client.view.html'
	})
	.state('edit-user', {
		url: '/users/:serial/edit',
		templateUrl: 'modules/users/views/edit-user.client.view.html'
	})
	.state('reset', {
		url: '/password/reset/:token',
		templateUrl: 'modules/users/views/password/reset-password.client.view.html'
	});
}]);

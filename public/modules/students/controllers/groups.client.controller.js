'use strict';

// Groups controller
angular.module('groups').controller('GroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groups', function ($scope, $stateParams, $location, Authentication, Groups) {
	$scope.authentication = Authentication;

	// Find a list of groups
	$scope.find = function() {
		$scope.groups = Groups.query();
	};
}]);

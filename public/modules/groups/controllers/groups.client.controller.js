'use strict';

// Groups controller
angular.module('groups').controller('GroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groups', function($scope, $stateParams, $location, Authentication, Groups) {
	$scope.authentication = Authentication;

	// Create new group
	$scope.create = function() {
		// Create new group object
		var group = new Groups ({
			name: this.name,
			description : this.description
		});

		// Redirect after save
		group.$save(function(response) {
			$location.path('groups/' + response.name);
			// Clear form fields
			$scope.name = '';
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Remove existing group
	$scope.remove = function(group) {
		if (group) {
			group.$remove();

			for (var i in $scope.groups) {
				if ($scope.groups [i] === group) {
					$scope.groups.splice(i, 1);
				}
			}
		} else {
			$scope.group.$remove(function() {
				$location.path('groups');
			});
		}
	};

	// Update existing group
	$scope.update = function() {
		var group = $scope.group;

		group.$update(function() {
			$location.path('groups/' + group.name);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find a list of groups
	$scope.find = function() {
		$scope.groups = Groups.query();
	};

	// Find existing group
	$scope.findOne = function() {
		$scope.group = Groups.get({ 
			groupId: $stateParams.groupId
		});
	};
}]);

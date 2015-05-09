'use strict';

// Activities controller
angular.module('activities').controller('ActivitiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Activities', '$http', function($scope, $stateParams, $location, Authentication, Activities, $http) {
	$scope.authentication = Authentication;
	$scope.teachers = [];
	$scope.allTeachers = [];

	$http.get('/list/teachers').success(function(data, status, headers, config) {
		for (var i = 0; i < data.length; i++) {
			$scope.allTeachers.push({
				name: data[i].serial,
				id: data[i]._id
			});
		}
	});

	$scope.loadTeachers = function(query) {
		return $scope.allTeachers;
	};

	// Create new activity
	$scope.create = function() {
		var teacherIDs = [];
		for (var i = 0; i < $scope.teachers.length; i++) {
			teacherIDs.push($scope.teachers[i].id);
		}
		// Create new Activity object
		var activity = new Activities({
			name: this.name,
			ID: this.ID,
			teachers: teacherIDs,
			weight: this.weight
		});
		// Redirect after save
		activity.$save(function(response) {
			$location.path('activities/' + response.ID);

			// Clear form fields
			$scope.name = '';
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Remove existing activity
	$scope.remove = function(activity) {
		if (activity) { 
			activity.$remove();

			for (var i in $scope.activities) {
				if ($scope.activities[i] === activity) {
					$scope.activities.splice(i, 1);
				}
			}
		} else {
			$scope.activity.$remove(function() {
				$location.path('activities');
			});
		}
	};

	// Update existing activity
	$scope.update = function() {
		var activity = $scope.activity;

		activity.$update(function() {
			$location.path('activities/' + activity.ID);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find a list of Activities
	$scope.find = function() {
		$scope.activities = Activities.query();
	};

	// Find existing Activity
	$scope.findOne = function() {
		$scope.activity = Activities.get({ 
			activityId: $stateParams.activityId
		});
	};
}]);

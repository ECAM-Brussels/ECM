'use strict';

// Exams controller
angular.module('exams').controller('ExamsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Exams', '$http', function($scope, $stateParams, $location, Authentication, Exams, $http) {
	$scope.authentication = Authentication;

	$scope.course = [];
	$scope.allCourses = [];
	$http.get('/courses').success(function(data, status, headers, config) {
		for (var i = 0; i < data.length; i++) {
			$scope.allCourses.push({
				name: data[i].ID,
				id: data[i]._id
			});
		}
	});
	$scope.loadCourses = function(query) {
		return $scope.allCourses;
	};

	$scope.activities = [];
	$scope.allActivities = [];
	$http.get('/activities').success(function(data, status, headers, config) {
		for (var i = 0; i < data.length; i++) {
			$scope.allActivities.push({
				name: data[i].ID,
				id: data[i]._id
			});
		}
	});
	$scope.loadActivities = function(query) {
		return $scope.allActivities;
	};

	$scope.rooms = [];
	$scope.allRooms = [];
	$http.get('/rooms').success(function(data, status, headers, config) {
		for (var i = 0; i < data.length; i++) {
			$scope.allRooms.push({
				name: data[i].ID,
				id: data[i]._id
			});
		}
	});
	$scope.loadRooms = function(query) {
		return $scope.allRooms;
	};

	$scope.groups = [];
	$scope.allGroups = [];
	$scope.loadGroups = function(query) {
		return $scope.allGroups;
	};

	// Create new Exam
	$scope.create = function() {
		// Create new Exam object
		var exam = new Exams ({
			name: this.name,
			activity: this.activity._id,
			date: this.date,
			rooms: new ObjsToIDs(this.selectedRooms),
			groups: this.groups
		});

		// Redirect after save
		exam.$save(function(response) {
			$location.path('exams/' + response._id);

			// Clear form fields
			$scope.name = '';
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Remove existing Exam
	$scope.remove = function(exam) {
		if (exam) { 
			exam.$remove();

			for (var i in $scope.exams) {
				if ($scope.exams[i] === exam) {
					$scope.exams.splice(i, 1);
				}
			}
		} else {
			$scope.exam.$remove(function() {
				$location.path('exams');
			});
		}
	};

	// Update existing Exam
	$scope.update = function() {
		var exam = $scope.exam;

		exam.$update(function() {
			$location.path('exams/' + exam._id);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find a list of Exams
	$scope.find = function() {
		$scope.exams = Exams.query();
	};

	// Find existing Exam
	$scope.findOne = function() {
		$scope.exam = Exams.get({ 
			examId: $stateParams.examId
		});
	};

	$scope.findCopy = function(activity, copies) {
		for (var i = 0; i < copies.length; i++) {
			if (copies[i].activity === activity._id) {
				$scope.copy = copies[i];
				return true;
			}
		}
		return false;
    };

    $scope.findTeacher = function(user, teachers) {
    	for (var i = 0; i < teachers.length; i++) {
    		if (teachers[i]._id === user._id) {
    			return true;
    		}
    	}
    	return false;
    };
}]);

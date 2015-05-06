'use strict';

// Exams controller
angular.module('exams').controller('ExamsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Exams', '$http', function($scope, $stateParams, $location, Authentication, Exams, $http) {
	$scope.authentication = Authentication;

	// Get ACTIVITIES
	$http.get('/activities').success(function(data) {
		$scope.allActivities = data;
	});

	// Get ROOMS
	$http.get('/rooms').success(function(data) {
		$scope.allRooms = data;
	});

	$scope.activity = null;
	$scope.selectedRooms = [];

	$scope.addActivity = function(obj) {
		if (exists(obj, $scope.allActivities)) {
			$scope.activity = obj;
		}
		$scope.searchActivities = '';
	};

	$scope.remActivity = function(obj) {
		$scope.activity = null;
	};

	$scope.addRoom = function(obj) {
		if (add(obj, $scope.allRooms, $scope.selectedRooms)) {
			$scope.searchRooms = '';
		}
	};

	$scope.remRoom = function(obj) {
		rem(obj, $scope.selectedRooms);
	};

	// Private methods for selector
	var ObjsToIDs = function(obj) {
		var result = [];
		for (var i = obj.length - 1; i >= 0; i--) {
			result[i] = obj[i]._id;
		}
		return result;
	};

	var exists = function(obj, arr) {
		return arr.indexOf(obj) > -1;
	};

	var add = function(obj, arrFrom, arrTo) {
		if (exists(obj, arrFrom)) {
			if (! exists(obj, arrTo)) {
				arrTo.push(obj);
			}
			return true;
		}
		return false;
	};

	var rem = function(obj, arr) {
		var i = arr.indexOf(obj);
		if (i > -1) {
			arr.splice(i, 1);
			return true;
		}
		return false;
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

	$scope.findCopy = function (activity, copies) {
		for (var i = 0; i < copies.length; i++) {
			if (copies[i].activity === activity._id) {
				$scope.copy = copies[i];
				return true;
			}
		}
		return false;
    };

    $scope.findTeacher = function (user, teachers) {
    	for (var i = 0; i < teachers.length; i++) {
    		if (teachers[i]._id === user._id) {
    			return true;
    		}
    	}
    	return false;
    };
}]);

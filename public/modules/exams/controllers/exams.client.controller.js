'use strict';

// Exams controller
angular.module('exams').controller('ExamsController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Exams', 'Copies', '$http', 'Upload', function($scope, $stateParams, $location, $window, Authentication, Exams, Copies, $http, Upload) {
	$scope.authentication = Authentication;
	$scope.split = false;

	// Load courses
	$scope.courses = [];
	var coursesList = [];
	$http.get('/courses').success(function(data, status, headers, config) {
		for (var i = 0; i < data.length; i++) {
			coursesList.push({
				name: data[i].ID,
				course: data[i]
			});
		}
	});
	$scope.loadCourses = function(query) {
		return coursesList;
	};

	// Load activities
	$scope.activities = [];
	var allActivities = [];
	$scope.activitiesList = [];
	$http.get('/activities').success(function(data, status, headers, config) {
		allActivities = data;
	});
	$scope.loadActivities = function(query) {
		return $scope.activitiesList;
	};

	// Load rooms
	$scope.rooms = [];
	var roomsList = [];
	$http.get('/rooms').success(function(data, status, headers, config) {
		for (var i = 0; i < data.length; i++) {
			roomsList.push({
				name: data[i].ID,
				room: data[i]
			});
		}
	});
	$scope.loadRooms = function(query) {
		return roomsList;
	};

	// Load groups
	$scope.groups = [];
	var groupsList = [];
	$http.get('/groups').success(function(data, status, headers, config) {
		for (var i = 0; i < data.length; i++) {
			groupsList.push({
				name: data[i].name,
				group: data[i]
			});
		}
	});
	$scope.loadGroups = function(query) {
		return groupsList;
	};

	// Create new exam
	$scope.create = function() {
		var activityIDs = [];
		for (var i = 0; i < $scope.activities.length; i++) {
			activityIDs.push($scope.activities[i].activity._id);
		}
		var roomIDs = [];
		for (i = 0; i < $scope.rooms.length; i++) {
			roomIDs.push($scope.rooms[i].room._id);
		}
		var groupIDs = [];
		for (i = 0; i < $scope.groups.length; i++) {
			groupIDs.push($scope.groups[i].group._id);
		}
		// Create new exam object
		var exam = new Exams({
			course: $scope.courses[0].course._id,
			activities: this.split ? [] : activityIDs,
			split: ! this.split,
			date: this.date,
			rooms: roomIDs,
			groups: groupIDs
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

	// Remove existing exam
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

	// Update existing exam
	$scope.update = function() {
		var exam = $scope.exam;
		exam.$update(function() {
			$location.path('exams/' + exam._id);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find a list of exams
	$scope.find = function() {
		$scope.exams = Exams.query();
	};

	// Find existing exam
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

	$scope.changeUnique = function() {
		if (! $scope.split || $scope.courses.length !== 1) {
			$scope.activities = [];
		}
	};

	function findActivity(course, activity) {
		for (var i = 0; i < course.activities.length; i++) {
			if (course.activities[i]._id === activity._id) {
				return true;
			}
		}
		return false;
	}

	$scope.changeCourse = function() {
		$scope.activitiesList = [];
		for (var i = 0; i < allActivities.length; i++) {
			if (findActivity($scope.courses[0].course, allActivities[i])) {
				$scope.activitiesList.push({
					name: allActivities[i].ID,
					activity: allActivities[i]
				});
			}
		}
	};

	// Set the number of series
	$scope.setSeries = function (activityID) {
		var files = new Array(this.series);
		for (var i = 0; i < files.length; i++) {
			files[i] = false;
		}
		// Create new copy object
		var copy = new Copies({
			exam: $scope.exam._id,
			activity: activityID,
			series: this.series,
			files: files
		});
		// Redirect after save
		copy.$save(function(response) {
			// Attach copy to exam
			$scope.exam.copies.push(copy._id);
			$scope.exam.$update(function() {
				$window.location.reload();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	$scope.getNumber = function(n) {
		return new Array(n);
	};

	$scope.fileSelected = function(files, event, index, copy) {
		if (files && files.length === 1) {
			Upload.upload({
				url: 'upload/copy',
				fields: {
					'username': $scope.authentication.user._id,
					'copy': copy,
					'index': index
				},
				file: files[0]
			}).progress(function(evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				console.log('progress: ' + progressPercentage + '% ');
			}).success(function(data, status, headers, config) {
				console.log('Upload finished ' + config.file.name + ', response ' + data);
			});
		}
	};
}]);

'use strict';

// Exams controller
angular.module('exams').controller('ExamsController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Exams', 'MyExams', 'Copies', '$http', 'Upload', '$filter', function($scope, $stateParams, $location, $window, Authentication, Exams, MyExams, Copies, $http, Upload, $filter) {
	$scope.authentication = Authentication;
	$scope.split = false;
	$scope.uploading = null;
	$scope.progressValue = null;

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
		return $filter('filter')(coursesList, query);
	};

	// Load activities
	$scope.activities = [];
	var allActivities = [];
	$scope.activitiesList = [];
	$http.get('/activities').success(function(data, status, headers, config) {
		allActivities = data;
	});
	$scope.loadActivities = function(query) {
		return $filter('filter')($scope.activitiesList, query);
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
		return $filter('filter')(roomsList, query);
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
		return $filter('filter')(groupsList, query);
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
		var course = [];
		if ($scope.courses.length > 0) {
			course = $scope.courses[0].course._id;
		}
		// Create new exam object
		var exam = new Exams({
			course: course,
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

	$scope.findMyExams = function(){
		$scope.exams = MyExams.query();
	};

	// Find existing exam
	$scope.findOne = function() {
		$scope.exam = Exams.get({ 
			examId: $stateParams.examId
		}, function(err) {
			// Fill uploading and progressValue
			if ($scope.exam.split) {
				// 
			} else {
				if ($scope.exam.copies[0]) {
					$scope.progressValue = new Array($scope.exam.copies[0].series);
					$scope.uploading = new Array($scope.exam.copies[0].series);
					for (var i = 0; i < $scope.exam.copies[0].series; i++) {
						$scope.progressValue[i] = null;
						$scope.uploading[i] = false;
					}
				}
			}
		});
	};

	$scope.findCopy = function(activity, copies) {
		for (var i = 0; i < copies.length; i++) {
			if (copies[i].activity === activity._id) {
				return true;
			}
		}
		return false;
	};

	$scope.testCopy = function(activity, copy) {
		return activity._id === copy.activity;
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
		if ($scope.split || $scope.courses.length !== 1) {
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
		var series = this.series;
		// Create new copy object
		var copy = new Copies({
			exam: $scope.exam._id,
			activity: activityID === -1 ? null : activityID,
			series: series
		});
		// Redirect after save
		copy.$save(function(response) {
			// Attach copy to exam
			$scope.exam.copies.push(copy);
			$scope.exam.$update(function() {
//				$scope.exam.copies.push(copy);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	$scope.getNumber = function(n) {
		var tab = new Array();
		for (var i = 0; i < n; i++) {
			tab.push(i);
		}
		return tab;
	};

	$scope.fileSelected = function(files, event, index, copy) {
		if ($scope.uploading && ! $scope.uploading[index] && files && files.length === 1) {
			// Reset form
			$scope.uploading[index] = true;
			copy.files[index] = null;
			$scope.progressValue[index] = 0;
			// Launch the upload
			Upload.upload({
				url: 'upload/copy',
				fields: {
					'username': $scope.authentication.user._id,
					'copy': copy._id,
					'exam': copy.exam,
					'index': index
				},
				file: files[0]
			}).progress(function(evt) {
				$scope.progressValue[index] = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function(data, status, headers, config) {
				$scope.progressValue[index] = null;
				$scope.uploading[index] = false;
				copy.files[index] = data;
			});
		}
	};

	$scope.validate = function(copy, index) {
		$http.post('/copies/validate', {'copy': copy._id, 'index': index}).success(function(data, status, headers, config) {
			$scope.exam.copies[0].files[index].validated = true;
		});
	};
}]);

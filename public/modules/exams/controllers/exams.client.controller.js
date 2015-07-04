'use strict';

// Exams filter by session
angular.module('exams').filter('filterBySession', function() {
	return function(exams, examsession) {
		var newItems = [];
		exams.forEach(function(exam) {
			if (exam.examsession.toString() === examsession._id) {
				newItems.push(exam);
			}
		});
		return newItems;
	};
});

// Exams controller
angular.module('exams').controller('ExamsController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Exams', 'MyExams', 'Copies', '$http', 'Upload', '$filter', function($scope, $stateParams, $location, $window, Authentication, Exams, MyExams, Copies, $http, Upload, $filter) {
	$scope.authentication = Authentication;
	$scope.uploading = null;
	$scope.progressValue = null;

	// Load courses
	$scope.courses = [];
	var coursesList = [];
	$http.get('/courses').success(function(data, status, headers, config) {
		data.forEach(function(course) {
			coursesList.push({
				name: course.ID,
				course: course
			});
		});
	});
	$scope.loadCourses = function(query) {
		return $filter('filter')(coursesList, query);
	};

	// Load examsessions
	$scope.examsessions = [];
	var examsessionsList = [];
	$http.get('/examsessions').success(function(data, status, headers, config) {
		data.forEach(function(examsession) {
			examsessionsList.push({
				name: examsession.name,
				examsession: examsession
			});
		});
	});
	$scope.loadExamsessions = function(query) {
		return $filter('filter')(examsessionsList, query);
	};

	// Load rooms
	$scope.rooms = [];
	var roomsList = [];
	$http.get('/rooms').success(function(data, status, headers, config) {
		data.forEach(function(room) {
			roomsList.push({
				name: room.ID,
				room: room
			});
		});
	});
	$scope.loadRooms = function(query) {
		return $filter('filter')(roomsList, query);
	};

	// Load groups
	$scope.groups = [];
	var groupsList = [];
	$http.get('/groups').success(function(data, status, headers, config) {
		data.forEach(function(group) {
			groupsList.push({
				name: group.name,
				group: group
			});
		});
	});
	$scope.loadGroups = function(query) {
		return $filter('filter')(groupsList, query);
	};

	// Create new exam
	$scope.create = function() {
		// Create new exam object
		var exam = new Exams({
			title: this.title,
			course: $scope.courses.length > 0 ? $scope.courses[0].course._id : [],
			examsession: $scope.examsessions.length > 0 ? $scope.examsessions[0].examsession._id : [],
			date: this.date,
			duration: this.duration
		});
		// Redirect after save
		exam.$save(function(response) {
			$location.path('exams/' + response._id);
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

	// Find all exams
	$scope.find = function() {
		// Load exam sessions
		$scope.examsessions = [];
		$http.get('/examsessions').success(function(data, status, headers, config) {
			$scope.examsessions = data;
		});
		// Load exams
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
			var exam = $scope.exam;
			// Fill uploading and progressValue
			if (exam.split) {
				console.log('Split');
			} else {
				if (exam.copies[0]) {
					$scope.progressValue = new Array(exam.copies[0].series);
					$scope.uploading = new Array(exam.copies[0].series);
					for (var i = 0; i < $scope.exam.copies[0].series; i++) {
						$scope.progressValue[i] = null;
						$scope.uploading[i] = false;
					}
				}
			}
			// Build CSV with affectation
			if (! exam.affectation || exam.affectation.length) {
				$scope.affectationCSV = 'Num;Firstname;Lastname;Seat;Room\n';
				for (var j = 0; j < exam.affectation.length; j++) {
					var affectation = exam.affectation[j];
					var student = affectation.student;
					$scope.affectationCSV += affectation.number + ';' + student.firstname + ';' + student.lastname + ';' + affectation.seat + ';' + affectation.room.ID + '\n';
				}
				$scope.affectationCSV = encodeURIComponent($scope.affectationCSV);
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

	function findActivity(course, activity) {
		for (var i = 0; i < course.activities.length; i++) {
			if (course.activities[i]._id === activity._id) {
				return true;
			}
		}
		return false;
	}

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
		var tab = [];
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

	// Validate a file of a copy of an exam
	$scope.validate = function(copies, copyindex, fileindex) {
		if (0 <= copyindex && copyindex < copies.length && 0 <= fileindex && fileindex < copies[copyindex].files.length) {
			$http.post('/copies/validate', {'copies': copies, 'copyindex': copyindex, 'fileindex': fileindex}).success(function(data, status, headers, config) {
				copies[copyindex].files[fileindex].validated = true;
			});
		}
	};

	$scope.validatePrint = function() {
		var exam = $scope.exam;
		exam.printed = new Date();
		exam.$update(function() {
			$location.path('print/exams/' + exam._id);
		}, function(errorResponse) {
			exam.printed = null;
			$scope.error = errorResponse.data.message;
		});
	};
}]);

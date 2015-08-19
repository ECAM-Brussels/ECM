'use strict';

// Exams controller
angular.module('exams').controller('ExamsController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Exams', 'MyExams', 'Copies', '$http', 'Upload', '$filter', function($scope, $stateParams, $location, $window, Authentication, Exams, MyExams, Copies, $http, Upload, $filter) {
	$scope.authentication = Authentication;
	$scope.uploading = null;
	$scope.progressValue = null;
	$scope.map = [];

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
	$scope.keys = function(obj) {
		return obj ? Object.keys(obj).sort() : [];
	}
	$scope.find = function() {
		// Load exam sessions
		$scope.examsessions = [];
		$http.get('/examsessions').success(function(data, status, headers, config) {
			$scope.examsessions = data;
			$scope.examBySession = {};
			for (var j = 0; j < $scope.examsessions.length; j++) {
				$scope.examBySession[$scope.examsessions[j]._id.toString()] = {};
			}
			// Load exams
			$scope.exams = Exams.query(function() {
				for (var i = 0; i < $scope.exams.length; i++) {
					var session = $scope.examBySession[$scope.exams[i].examsession.toString()];
					var date = moment($scope.exams[i].date).format('DD-MM-YYYY');
					if (! (date in session)) {
						session[date] = {
							'date': $scope.exams[i].date,
							'exams': []
						};
					}
					session[date].exams.push($scope.exams[i]);
				}
			});
		});
	};

	$scope.findMyExams = function(){
		$scope.exams = MyExams.query();
	};

	// Find existing exam
	$scope.findOne = function() {
		$scope.exam = Exams.get({examId: $stateParams.examId}, function(err) {
			var exam = $scope.exam;
			// Fill uploading and progressValue
			$scope.copiesOK = true;
			if (exam.copies) {
				$scope.progressValue = new Array(exam.copies.length);
				$scope.uploading = new Array(exam.copies.length);
				for (var i = 0; i < exam.copies.length; i++) {
					$scope.progressValue[i] = null;
					$scope.uploading[i] = false;
					if (! exam.copies[i].validated) {
						$scope.copiesOK = false;
					}
				}
			}
			// Clear already affected rooms
			for (var j = 0; j < exam.rooms.length; j++) {
				var index = findRoom(exam.rooms[j].room);
				if (index !== -1) {
					roomsList.splice(index, 1);
				}
			}
			// Loading data
/*			// Build CSV with affectation
			if (! exam.affectation || exam.affectation.length) {
				$scope.affectationCSV = 'Num;Firstname;Lastname;Seat;Room\n';
				for (var j = 0; j < exam.affectation.length; j++) {
					var affectation = exam.affectation[j];
					var student = affectation.student;
					$scope.affectationCSV += affectation.number + ';' + student.firstname + ';' + student.lastname + ';' + affectation.seat + ';' + affectation.room.ID + '\n';
				}
				$scope.affectationCSV = encodeURIComponent($scope.affectationCSV);
			}*/
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

	// Validate exam
	$scope.validateExam = function() {
		$http.post('/exams/validate', {'exam': $scope.exam._id}).success(function(data, status, headers, config) {
			$scope.exam.ready = true;
			$scope.exam.affectation = data.affectation;
			for (var i = 0; i < $scope.exam.rooms.length; i++) {
				drawMap(i);
			}
		});
	};

	// Add rooms for the exam
	function findRoom(room) {
		for (var i = 0; i < roomsList.length; i++) {
			if (roomsList[i].room.toString() === room.toString()) {
				return i;
			}
		}
		return -1;
	}

	$scope.addrooms = [];
	$scope.addRooms = function(rooms) {
		var roomstoadd = [];
		rooms.forEach(function(room) {
			roomstoadd.push(room.room);
		});
		$http.post('/exams/addrooms', {'exam': $scope.exam._id, 'rooms': roomstoadd}).success(function(data, status, headers, config) {
			$scope.addrooms = [];
			for (var i = 0; i < data.rooms.length; i++) {
				var index = findRoom(data.rooms[i].room);
				if (index !== -1) {
					roomsList.splice(index, 1);
				}
			}
			$scope.exam.rooms = data.rooms;
		});
	};

	// Change room configuration
	$scope.changeConfiguration = function(index) {
		$http.post('exams/config', {'exam': $scope.exam._id, 'index' : index, 'layout': $scope.exam.rooms[index].layout, 'start': $scope.exam.rooms[index].start}).success(function(data, status, headers, config) {
			$scope.exam.rooms = data.rooms;
			drawMap(index);
		});
	};

	// Draw room maps
	function drawMap(index) {
		var map = $scope.map[index];
		// Set up canvas
		var canvas = document.getElementById('roomplaces' + $scope.exam.rooms[index].room._id);
		canvas.width = map.width;
		canvas.height = map.height;
		// Initialise context
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, map.width, map.height);
		context.strokeRect(0, 0, map.width, map.height);
		// Context style
		context.scale(1, 1);
		context.font = 'normal 7pt Arial';
		// Draw all shapes
		map.shapes.forEach (function(shape) {
			var attr = shape.attr;
			switch (shape.type) {
				case 'rectangle':
					context.strokeRect(attr.x, attr.y, attr.width, attr.height);
				break;

				case 'text':
					context.fillText(attr.value, attr.x, attr.y);
				break;
			}
		});
		// Draw configuration
		context.textAlign = 'center';
		var room = $scope.exam.rooms[index];
		var seats = room.room.configuration[room.layout].seats;
		for (var i = room.start - 1; i < seats.length; i++) {
			var seatcoord = $scope.map[index].seats[seats[i].seat];
			context.fillText('#' + (i + 1), seatcoord.x, seatcoord.y);
		}
		// Draw affectation
		if ($scope.exam.ready) {
			var affectation = $scope.exam.affectation;
			for (var j = 0; j < affectation.length; j++) {
				if (affectation[j].room === index) {
					var seatcoord = $scope.map[index].seats[room.room.configuration[room.layout].seats[affectation[j].number].seat];
					var name = affectation[j].student.lastname;
					while (context.measureText(name).width > seatcoord.maxwidth) {
						name = name.substring(0, name.length - 1);
					}
					context.fillText(name, seatcoord.x, seatcoord.y + 10);
				}
			}
		}
		// Generate button
		var downloadbtn = document.getElementById('roomplacesbtn' + $scope.exam.rooms[index].room._id);
		downloadbtn.href = canvas.toDataURL("image/png");
	}

	$scope.loadMap = function(index) {
		$http.get('images/rooms/' + $scope.exam.rooms[index].room._id + '/map.json').success(function(data, status, headers, config) {
			$scope.map[index] = data;
			drawMap(index);
		});
	};

	// Import students for the exam
	$scope.importStudents = function(files) {
		if (files.length === 1) {
			Papa.parse(files[0], {
				complete: function(results) {
					$http.post('/students/register', {'exam': $scope.exam._id, 'students': results.data}).success(function(data, status, headers, config) {
						$scope.exam.affectation = data.affectation;
					});
				}
			});
		}
	};

	// Add a questionnaire for the exam
	$scope.addCopy = function() {
		$http.post('/copies/add', {'exam': $scope.exam._id}).success(function(data, status, headers, config) {
			$scope.exam.copies.push({
				name: null,
				validated: false
			});
		});
	};

	$scope.getNumber = function(n) {
		var tab = [];
		for (var i = 0; i < n; i++) {
			tab.push(i);
		}
		return tab;
	};

	$scope.getLetter = function(i) {
		return String.fromCharCode(65 + i);
	};

	// Upload a file for a questionnaire
	$scope.fileSelected = function(files, index) {
		if ($scope.uploading && ! $scope.uploading[index] && files && files.length === 1) {
			// Reset form
			$scope.uploading[index] = true;
			$scope.exam.copies[index] = null;
			$scope.progressValue[index] = 0;
			// Launch the upload
			Upload.upload({
				url: 'upload/copy',
				fields: {
					'username': $scope.authentication.user._id,
					'exam': $scope.exam._id,
					'index': index
				},
				file: files[0]
			}).progress(function(evt) {
				$scope.progressValue[index] = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function(data, status, headers, config) {
				$scope.progressValue[index] = null;
				$scope.uploading[index] = false;
				$scope.exam.copies[index] = data.copies[index];
			});
		}
	};

	// Validate a questionnaire for the exam
	$scope.validate = function(index) {
		if (0 <= index && index < $scope.exam.copies.length) {
			$http.post('/copies/validate', {'exam': $scope.exam._id, 'index': index}).success(function(data, status, headers, config) {
				$scope.exam.copies[index].validated = true;
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

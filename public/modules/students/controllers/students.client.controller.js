'use strict';

/*global Papa:false */
function load_script(url) {
	var s = document.createElement('script'); 
	s.src = url;
	document.body.appendChild(s);
}

// Students controller
angular.module('students').controller('StudentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Students', '$http', function($scope, $stateParams, $location, Authentication, Students, $http) {
	$scope.authentication = Authentication;

	// Load groups
	$scope.groups = [];
	$scope.allGroups = [];
	$http.get('/groups').success(function(data, status, headers, config) {
		for (var i = 0; i < data.length; i++) {
			$scope.allGroups.push({
				name: data[i].name,
				id: data[i]._id
			});
		}
	});
	$scope.loadGroups = function(query) {
		return $scope.allGroups;
	};

	// Create new student
	$scope.create = function() {
		var groupIDs = [];
		for (var i = 0; i < $scope.groups.length; i++) {
			groupIDs.push($scope.groups[i].id);
		}
		// Create new student object
		var student = new Students({
			matricule: this.matricule,
			firstname: this.firstname,
			lastname: this.lastname,
			middlenames: this.middlenames,
			groups: groupIDs
		});
		// Redirect after save
		student.$save(function(response) {
			$location.path('students/' + response.matricule);
			$scope.name = '';
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Remove existing student
	$scope.remove = function(student) {
		if (student) { 
			student.$remove();
			for (var i in $scope.students) {
				if ($scope.students [i] === student) {
					$scope.students.splice(i, 1);
				}
			}
		} else {
			$scope.student.$remove(function() {
				$location.path('students');
			});
		}
	};

	// Update existing student
	$scope.update = function() {
		var student = $scope.student;
		student.$update(function() {
			$location.path('students/' + student.matricule);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find a list of students
	$scope.find = function() {
		$scope.students = Students.query();
	};

	// Find existing student
	$scope.findOne = function() {
		$scope.student = Students.get({ 
			studentId: $stateParams.studentId
		});
	};

	$scope.importCSV = function(){
		var file = document.getElementById('fileinput').files[0];
		if(file !== undefined) {
			return readCSV(file);
		}
		$scope.error = 'Please choose a CSV file';
	};

	var readCSV = function(CSVFile) {
		Papa.parse(CSVFile, {
			complete: function(results) {
				workOnCSV(results.data);
			}
		});
	};

	var workOnCSV = function(data) {
		console.log(data);
		for (var i = 0; i < data.length; i++) {
			console.log(data[i]);
		}
		$http.post('/import/students', {'data': data}).success(function(data, status, headers, config) {
			// 
		});
	};

	load_script('/serve/papaparse.min.js');
}]);

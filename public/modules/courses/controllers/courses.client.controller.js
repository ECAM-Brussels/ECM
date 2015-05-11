'use strict';

// Courses controller
angular.module('courses').controller('CoursesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', 'MyCourses', '$http', function($scope, $stateParams, $location, Authentication, Courses, MyCourses, $http) {
	$scope.authentication = Authentication;

	// Load teachers
	$scope.coordinator = [];
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

	// Load activities
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

	// Create new course
	$scope.create = function() {
		var activityIDs = [];
		for (var i = 0; i < $scope.activities.length; i++) {
			activityIDs.push($scope.activities[i].id);
		}
		// Create new course object
		var course = new Courses ({
			ID: this.ID,
			name: this.name,
			coordinator: $scope.coordinator[0].id,
			activities: activityIDs
		});
		// Redirect after save
		course.$save(function(response) {
			$location.path('courses/' + response.ID);

			// Clear form fields
			$scope.name = '';
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Remove existing course
	$scope.remove = function(course) {
		if (course) { 
			course.$remove();

			for (var i in $scope.courses) {
				if ($scope.courses [i] === course) {
					$scope.courses.splice(i, 1);
				}
			}
		} else {
			$scope.course.$remove(function() {
				$location.path('courses');
			});
		}
	};

	// Update existing course
	$scope.update = function() {
		var course = $scope.course;

		course.$update(function() {
			$location.path('courses/' + course.ID);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find a list of courses
	$scope.find = function() {
		$scope.courses = Courses.query();
	};

	$scope.findMyCourses = function(){
		$scope.courses = MyCourses.query();
	};

	// Find existing Course
	$scope.findOne = function() {
		$scope.course = Courses.get({ 
			courseId: $stateParams.courseId
		});
	};
}]);

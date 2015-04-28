'use strict';

// Courses controller
angular.module('courses').controller('CoursesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', 'MyCourses', '$http',
	function($scope, $stateParams, $location, Authentication, Courses, MyCourses, $http) {
		$scope.authentication = Authentication;

    // Get TEACHERS
    $http.get('/list/teachers').success(function(data) {
       $scope.allTeachers = data;
    });
    // Get ACTIVITIES
    $http.get('/activities').success(function(data) {
       $scope.allActivities = data;
    });

    $scope.selectedTeachers = [];
    $scope.selectedActivities = [];

    // Public methods for selector
    $scope.addTeacher = function(obj){
      if(add(obj, $scope.allTeachers, this.selectedTeachers)) $scope.searchTeachers = '';
    };

    $scope.remTeacher = function(obj){
      rem(obj, $scope.selectedTeachers);
    };

    $scope.addActivity = function(obj){
      if(add(obj, $scope.allActivities, $scope.selectedActivities)) $scope.searchActivities = '';
    };

    $scope.remActivity = function(obj){
      rem(obj, $scope.selectedActivities);
    };

    // Private methods for selector
    var ObjsToIDs = function(obj){
      var result = [];
      for (var i = obj.length - 1; i >= 0; i--) {
        result[i] = obj[i]._id;
      }
      return result;
    };

    var exists = function(obj, arr) {
      return arr.indexOf(obj) > -1;
    };

    var add = function(obj, arrFrom, arrTo){
      if(exists(obj, arrFrom)){
        if(!exists(obj, arrTo)){
          arrTo.push(obj);
        }
        return true;
      }
      return false;
    };

    var rem = function(obj, arr){
      var i = arr.indexOf(obj);
      if(i > -1){
        arr.splice(i, 1);
        return true;
      }
      return false;
    };

		// Create new Course
		$scope.create = function() {
			// Create new Course object
			var course = new Courses ({
        ID: this.ID,
				name: this.name,
        coordinators: new ObjsToIDs(this.selectedTeachers),
        activities: new ObjsToIDs(this.selectedActivities)
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

		// Remove existing Course
		$scope.remove = function(course) {
			if ( course ) { 
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

		// Update existing Course
		$scope.update = function() {
			var course = $scope.course;

			course.$update(function() {
				$location.path('courses/' + course.ID);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Courses
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
	}
]);

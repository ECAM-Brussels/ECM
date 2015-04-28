'use strict';

// Activities controller
angular.module('activities').controller('ActivitiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Activities', '$http',
	function($scope, $stateParams, $location, Authentication, Activities, $http) {
		$scope.authentication = Authentication;

    // Get TEACHERS
    $http.get('/list/teachers').success(function(data, status, headers, config) {
       $scope.allTeachers = data;
    });

    $scope.selectedTeachers = [];

    $scope.addTeacher = function(obj){
      if(add(obj, $scope.allTeachers, $scope.selectedTeachers)) $scope.searchText = '';
    };

    $scope.removeTeacher = function(obj){
      rem(obj, $scope.selectedTeachers);
    };

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


		// Create new Activity
		$scope.create = function() {
			// Create new Activity object
			var activity = new Activities ({
				name: this.name,
        ID: this.ID,
        teachers: new ObjsToIDs(this.selectedTeachers),
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

		// Remove existing Activity
		$scope.remove = function(activity) {
			if ( activity ) { 
				activity.$remove();

				for (var i in $scope.activities) {
					if ($scope.activities [i] === activity) {
						$scope.activities.splice(i, 1);
					}
				}
			} else {
				$scope.activity.$remove(function() {
					$location.path('activities');
				});
			}
		};

		// Update existing Activity
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
	}
]);

'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$http' ,'$location', 'Authentication', 'Users',
  function($scope, $stateParams, $http, $location, Authentication, Users) {
    $scope.authentication = Authentication;

    $scope.find = function(){
      $scope.users = Users.query();
    };

    $scope.createUser = function() {
      $http.post('/users', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the index page
        $location.path('/users');
      }).error(function(response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$http' ,'$location', 'Authentication', 'Users',
  function($scope, $stateParams, $http, $location, Authentication, Users) {
    $scope.authentication = Authentication;

    $scope.find = function(){
      $scope.users = Users.query();
    };


    $scope.createUser = function() {
      $http.post('/users', $scope.credentials).success(function(response) {
        $location.path('/users');
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    // Find existing Room
    $scope.findOne = function() {
      $scope.user = Users.get({ 
        serial: $stateParams.serial
      });
    };


  }
]);

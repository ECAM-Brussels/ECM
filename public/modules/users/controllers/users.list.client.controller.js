'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
  function($scope, $stateParams, $location, Authentication, Users) {
    $scope.authentication = Authentication;

    $scope.findTeachers = function() {
      $scope.users = Users.query();
    };
  }
]);

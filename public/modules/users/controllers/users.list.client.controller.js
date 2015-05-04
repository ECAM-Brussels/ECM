'use strict';
angular.module( 'users' ).controller( 'UsersController', [ '$scope', '$stateParams', '$http', '$location', 'Authentication', 'Users',
  function ( $scope, $stateParams, $http, $location, Authentication, Users ) {
    $scope.authentication = Authentication;
    $scope.find = function () {
      $scope.users = Users.query();
    };
    $scope.createUser = function () {
      $http.post( '/users', $scope.credentials ).success( function ( response ) {
        $location.path( '/users' );
      } ).error( function ( response ) {
        $scope.error = response.message;
      } );
    };

    // Find existing user
    $scope.findOne = function () {
      var u = Users.get( {
        serial: $stateParams.serial
      }, function () {
        u.rights = {
          manager: exists( 'manager', u.roles ),
          admin: exists( 'admin', u.roles ),
          user: exists( 'user', u.roles ),
          teacher: exists( 'teacher', u.roles ),
          printer: exists( 'printer', u.roles )
        };
        $scope.profile = u;
      } );
    };

    var exists = function ( val, array ) {
      if ( array.indexOf( val ) > -1 ) return true;
      return false;
    };

    // Find existing user
    $scope.remove = function(profile) {
      if ( profile ) {
        profile.$remove();

        for (var i in $scope.users) {
          if ($scope.users [i] === profile) {
            $scope.users.splice(i, 1);
          }
        }
      } else {
        $scope.profile.$remove(function() {
          $location.path('users');
        });
      }
    };

  }
 ] );

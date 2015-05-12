'use strict';
angular.module( 'users' ).controller( 'UsersController', [ '$scope', '$stateParams', '$http', '$location', 'Authentication', 'Users', function ( $scope, $stateParams, $http, $location, Authentication, Users) {
	$scope.authentication = Authentication;

	$scope.find = function() {
		$scope.users = Users.query();
	};

	$scope.createUser = function () {
		$http.post('/users', $scope.credentials).success(function(response) {
			$location.path('/users');
		}).error(function(response) {
			$scope.error = response.message;
		});
	};

	$scope.updateUser = function() {
		var user = $scope.profile;
		user.$update(function() {
			$location.path('users/' + user.serial);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};
	
	// Find existing user
	$scope.findOne = function() {
		var user = Users.get({
			serial: $stateParams.serial
		}, function() {
			user.rights = {
				manager: exists('manager', user.roles),
				admin: exists('admin', user.roles),
				user: exists('user', user.roles),
				teacher: exists('teacher', user.roles),
				printer: exists('printer', user.roles)
			};
			$scope.profile = user;
		});
	};

	var exists = function(val, array) {
		return array.indexOf(val) > -1;
	};

	// Find existing user
	$scope.remove = function(profile) {
		if (profile) {
			profile.$remove();
			for (var i in $scope.users) {
				if ($scope.users[i] === profile) {
					$scope.users.splice(i, 1);
				}
			}
		} else {
			$scope.profile.$remove(function() {
				$location.path('users');
			});
		}
	};
}]);

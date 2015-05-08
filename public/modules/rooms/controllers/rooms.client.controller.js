'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms', 'Upload', function ($scope, $stateParams, $location, Authentication, Rooms, Upload) {
	$scope.authentication = Authentication;

	// Create new Room
	$scope.create = function() {
		// Create new Room object
		var room = new Rooms( {
			ID: this.ID,
			name: this.name,
			seats: this.seats
		});

		// Redirect after save
		room.$save(function(response) {
			$location.path('rooms/' + response.ID);
			// Clear form fields
			$scope.name = '';
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Remove existing Room
	$scope.remove = function(room) {
		if (room) {
			room.$remove();

			for (var i in $scope.rooms) {
				if ($scope.rooms[i] === room) {
					$scope.rooms.splice(i, 1);
				}
			}
		} else {
			$scope.room.$remove(function() {
				$location.path('rooms');
			});
		}
	};

	// Update existing Room
	$scope.update = function() {
		var room = $scope.room;

		room.$update(function() {
			$location.path('rooms/' + room.ID);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find a list of Rooms
	$scope.find = function() {
		$scope.rooms = Rooms.query();
	};

    // Find existing Room
    $scope.findOne = function() {
		$scope.room = Rooms.get({
			roomId: $stateParams.roomId
		});
	};

	// For the file upload
	$scope.$watch('files', function(){
		$scope.upload($scope.files);
	});

	$scope.upload = function(files) {
		if (files && files.length === 1) {
			Upload.upload({
				url: 'upload/room',
				fields: {'username': $scope.authentication.user._id},
				file: files[0]
			}).progress(function(evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				console.log('progress: ' + progressPercentage + '% ');
			}).success(function(data, status, headers, config) {
				console.log('Upload finished ' + config.file.name + ', response ' + data);
				$scope.path = 'images/uploads/' + data;
			});
		}
	};
}]);

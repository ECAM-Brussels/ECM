'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Rooms', 'Upload', function ($scope, $stateParams, $location, $http, Authentication, Rooms, Upload) {
	$scope.authentication = Authentication;
	$scope.uploading = false;
	$scope.path = null;
	$scope.progressValue = null;
	$scope.map = null;
	$scope.configuration = -1;

	// Create new room
	$scope.create = function() {
		// Create new room object
		var room = new Rooms({
			ID: this.ID,
			name: this.name,
			seats: this.seats,
			path: $scope.path
		});

		// Redirect after save
		room.$save(function(response) {
			$location.path('rooms/' + response.ID);
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
	$scope.upload = function(files) {
		if (! $scope.uploading && files && files.length === 1) {
			// Reset form
			$scope.uploading = true;
			$scope.path = null;
			$scope.progressValue = 0;
			// Launch the upload
			Upload.upload({
				url: 'upload/room',
				fields: {'username': $scope.authentication.user._id},
				file: files[0]
			}).progress(function(evt) {
				$scope.progressValue = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function(data, status, headers, config) {
				$scope.progressValue = null;
				$scope.path = 'images/uploads/' + data;
				$scope.uploading = false;
			});
		}
	};

	// For the room map
	function drawMap() {
		var map = $scope.map;
		// Set up canvas
		var canvas = document.getElementById('roomplaces');
		canvas.width = map.width;
		canvas.height = map.height;
		// Initialise context
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, map.width, map.height);
		context.strokeRect(0, 0, map.width, map.height);
		context.scale(1, 1);
		// Draw all shapes
		map.shapes.forEach (function(shape) {
			var attr = shape.attr;
			switch (shape.type) {
				case 'rectangle':
					context.strokeRect(attr.x, attr.y, attr.width, attr.height);
				break;

				case 'text':
					context.fillText(attr.value, attr.x, attr.y);
				break;
			}
		});
		// Draw configuration
		if ($scope.configuration !== -1) {
			$scope.room.configuration[$scope.configuration].seats.forEach(function(seat) {
				var seatcoord = $scope.map.seats[seat.seat];
				context.fillText('X', seatcoord.x, seatcoord.y);
			});
		}
	}
	
	$scope.loadMap = function() {
		if ($scope.map === null) {
			$http.get('images/rooms/' + $scope.room._id + '/map.json').success(function(data, status, headers, config) {
				$scope.map = data;
				drawMap();
			});
		}
	};

	$scope.getNumber = function(n) {
		var tab = [];
		for (var i = 0; i < n; i++) {
			tab.push(i);
		}
		return tab;
	};

	// Change room configuration
	$scope.changeConfiguration = function(conf) {
		$scope.configuration = conf;
		drawMap();
	};
}]);

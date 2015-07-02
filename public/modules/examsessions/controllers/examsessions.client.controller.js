'use strict';

// Exam sessions controller
angular.module('examsessions').controller('ExamSessionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ExamSessions', function($scope, $stateParams, $location, Authentication, ExamSessions) {
	$scope.authentication = Authentication;

	// Create new exam session
	$scope.create = function() {
		// Create new ExamSession object
		var examsession = new ExamSessions ({
			name: this.name,
			description: this.description,
			from: this.from,
			to: this.to
		});

		// Redirect after save
		examsession.$save(function(response) {
			$location.path('examsessions/' + response._id);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Remove existing exam session
	$scope.remove = function(examsession) {
		if (examsession) { 
			examsession.$remove();

			for (var i in $scope.examsessions) {
				if ($scope.examsessions[i] === examsession) {
					$scope.examsessions.splice(i, 1);
				}
			}
		} else {
			$scope.examsession.$remove(function() {
				$location.path('examsessions');
			});
		}
	};

	// Update existing exam session
	$scope.update = function() {
		var examsession = $scope.examsession;
		examsession.$update(function() {
			$location.path('examsessions/' + examsession._id);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
	};

	// Find a list of exam sessions
	$scope.find = function() {
		$scope.examsessions = ExamSessions.query();
	};

	// Find existing exam session
	$scope.findOne = function() {
		$scope.examsession = ExamSessions.get({ 
			examSessionId: $stateParams.examSessionId
		});
	};
}]);

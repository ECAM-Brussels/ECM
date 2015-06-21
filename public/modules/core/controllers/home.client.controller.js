'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', function($scope, Authentication) {
	// Provides Authentication context
	$scope.authentication = Authentication;
}]);

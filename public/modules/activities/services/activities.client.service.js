'use strict';

//Activities service used to communicate Activities REST endpoints
angular.module('activities').factory('Activities', ['$resource', function($resource) {
	return $resource('activities/:activityId', {
		activityId: '@ID'
	}, {
		update: {
			method: 'PUT'
		}
	});
}]);

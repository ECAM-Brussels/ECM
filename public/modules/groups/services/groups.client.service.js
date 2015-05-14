'use strict';

// Groups service used to communicate groups REST endpoints
angular.module('groups').factory('Groups', ['$resource', function($resource) {
	return $resource('groups/:groupId', { groupId: '@name'
	}, {
		update: {
			method: 'PUT'
		}
	});
}]);

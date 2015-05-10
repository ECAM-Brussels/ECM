'use strict';

// Students service used to communicate students REST endpoints
angular.module('groups').factory('Groups', ['$resource', function($resource) {
	return $resource('groups', {}, {
		update: {
			method: 'PUT'
		}
	});
}]);

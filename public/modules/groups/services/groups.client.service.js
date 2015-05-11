'use strict';

//Groups service used to communicate Groups REST endpoints
angular.module('groups').factory('Groups', ['$resource',
	function($resource) {
		return $resource('groups/:groupId', { groupId: '@name'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

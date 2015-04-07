'use strict';

//Courses service used to communicate Courses REST endpoints
angular.module('courses').factory('Courses', ['$resource',
	function($resource) {
		return $resource('courses/:courseId', { courseId: '@ID'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
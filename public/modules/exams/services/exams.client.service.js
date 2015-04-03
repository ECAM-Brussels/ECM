'use strict';

//Exams service used to communicate Exams REST endpoints
angular.module('exams').factory('Exams', ['$resource',
	function($resource) {
		return $resource('exams/:examId', { examId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
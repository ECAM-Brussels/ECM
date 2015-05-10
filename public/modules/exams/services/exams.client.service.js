'use strict';

// Exams service used to communicate Exams REST endpoints
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

// Copies service used to communicate Exams REST endpoints
angular.module('exams').factory('Copies', ['$resource',
	function($resource) {
		return $resource('copies/:copyId', { copyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

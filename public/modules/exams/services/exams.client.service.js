'use strict';

// Exams service used to communicate exams REST endpoints
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

// MyExams service used to communicate exams REST endpoints
angular.module('courses').factory('MyExams', ['$resource', function($resource) {
	return $resource('list/MyExams', {}, {
		update: {
			method: 'PUT'
		}
	});
}]);

// Copies service used to communicate copies REST endpoints
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

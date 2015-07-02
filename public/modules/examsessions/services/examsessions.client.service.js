'use strict';

// Exam sessions service used to communicate exam sessions REST endpoints
angular.module('examsessions').factory('ExamSessions', ['$resource', function($resource) {
	return $resource('examsessions/:examSessionId', {
		examSessionId: '@_id'
	}, {
		update: {
			method: 'PUT'
		}
	});
}]);

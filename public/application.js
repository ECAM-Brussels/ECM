'use strict';

// Start by defining the main module and adding the module dependencies
var app = angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('!');
}]);

// Configure translation
app.config(['$translateProvider', function($translateProvider) {
	$translateProvider.useStaticFilesLoader({
		prefix: 'languages/',
		suffix: '.json'
	});
	$translateProvider.preferredLanguage('en_GB');
}]);
app.controller('LanguageController', ['$scope', '$translate', function($scope, $translate) {
	$scope.lang = 'en_GB';
	$scope.changeLanguage = function(lang) {
		$translate.use(lang);
	};
}]);

// Then define the function to start up the application
angular.element(document).ready(function() {
	// Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') {
		window.location.hash = '#!';
	}

	// Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Start by defining the main module and adding the module dependencies
var app = angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('!');
}]);

// Configure translation
app.config(['$translateProvider', function($translateProvider) {
	$translateProvider.useSanitizeValueStrategy('escape');
	$translateProvider.useStaticFilesLoader({
		prefix: 'lang/',
		suffix: '.json'
	});
	$translateProvider.preferredLanguage('en_GB');
	$translateProvider.useLocalStorage();
}]);
app.controller('LanguageController', ['$scope', '$translate', '$translateLocalStorage', function($scope, $translate, $translateLocalStorage) {
	$scope.lang = $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY');
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

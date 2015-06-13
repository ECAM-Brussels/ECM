'use strict';

// Configuring the Articles module
angular.module('groups').run(['Menus', function (Menus) {
	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'Groups', 'groups', 'groups', false, ['admin']);
}]);

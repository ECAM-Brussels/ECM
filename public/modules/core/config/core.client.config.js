'use strict';

// Set up the menu for the core module
angular.module('core').run(['Menus', function(Menus) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'Dashboard', 'dashboard', 'dropdown', '/dashboard', false, ['teacher']);
	Menus.addMenuItem('topbar', 'Manage', 'manage', 'dropdown', '/manage', false, ['admin', 'manager']);
	Menus.addMenuItem('topbar', 'Tools', 'tools', 'dropdown', '/tools', false, ['admin', 'manager']);
}]);

'use strict';

// Set up the menu for the core module
angular.module('core').run(['Menus', function(Menus) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'MENU.DASHBOARD', 'dashboard', 'dropdown', '/dashboard', false, ['teacher']);
	Menus.addMenuItem('topbar', 'MENU.MANAGE', 'manage', 'dropdown', '/manage', false, ['admin', 'manager']);
	Menus.addMenuItem('topbar', 'MENU.TOOLS', 'tools', 'dropdown', '/tools', false, ['admin', 'manager']);
}]);

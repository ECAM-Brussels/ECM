'use strict';

// Set up the menu for the rooms module
angular.module('rooms').run(['Menus', function(Menus) {
	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'Rooms', 'rooms', 'rooms', false, ['admin']);
}]);

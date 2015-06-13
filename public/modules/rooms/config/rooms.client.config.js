'use strict';

// Configuring the Articles module
angular.module('rooms').run(['Menus', function (Menus) {
	// Set manage menu items
	Menus.addSubMenuItem('topbar', 'manage', 'Rooms', 'rooms', 'rooms', false, ['admin']);

	// Set top bar menu items
//	Menus.addMenuItem('topbar', 'Rooms', 'rooms', 'dropdown', '/rooms(/create)?', false, ['admin']);
//	Menus.addSubMenuItem('topbar', 'rooms', 'Create', 'rooms/create', 'rooms/create', false, ['admin']);
}]);

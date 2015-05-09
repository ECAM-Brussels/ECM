'use strict';

// Configuring the Articles module
angular.module('rooms').run(['Menus', function (Menus) {
	// Set top bar menu items
	Menus.addMenuItem('topbar', 'Rooms', 'rooms', 'dropdown', '/rooms(/create)?', false, ['admin', 'manager']);
	Menus.addSubMenuItem('topbar', 'rooms', 'List', 'rooms', 'rooms', false, ['admin', 'manager']);
	Menus.addSubMenuItem('topbar', 'rooms', 'Create', 'rooms/create', 'rooms/create', false, ['admin']);
}]);

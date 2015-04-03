'use strict';

// Configuring the Articles module
angular.module('rooms').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Rooms', 'rooms', 'dropdown', '/rooms(/create)?');
		Menus.addSubMenuItem('topbar', 'rooms', 'List Rooms', 'rooms');
		Menus.addSubMenuItem('topbar', 'rooms', 'New Room', 'rooms/create');
	}
]);
'use strict';

// Configuring the Articles module
angular.module( 'exams' ).run( [ 'Menus',
 function ( Menus ) {
    // Set top bar menu items
    Menus.addMenuItem( 'topbar', 'Exams', 'exams', 'dropdown', '/exams(/create)?', false, [ 'admin', 'manager', 'teacher', 'printer' ] );
    Menus.addSubMenuItem( 'topbar', 'exams', 'List', 'exams', 'exams', false, [ 'admin', 'manager', 'teacher', 'printer' ] );
    Menus.addSubMenuItem( 'topbar', 'exams', 'New', 'exams/create', 'exams/create', false, [ 'admin', 'manager' ] );
 }
 ] );

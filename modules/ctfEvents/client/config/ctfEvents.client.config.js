'use strict';

// Configuring the CtfEvents module
angular.module('ctfEvents').run(['Menus',
  function (Menus) {
    // Add the ctfEvents dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Events',
      state: 'ctfEvents',
      type: 'dropdown'
    });

    Menus.addSubMenuItem('topbar', 'ctfEvents', {
      title: 'List Events',
      state: 'ctfEvents.upcoming',
      roles: ['*']
    });

    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Events',
      state: 'ctfEvents.list',
      type: 'dropdown',
      roles: ['admin'],
      position: 3
    });

  }
]);

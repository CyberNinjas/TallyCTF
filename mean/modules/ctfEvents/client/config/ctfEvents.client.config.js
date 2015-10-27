'use strict';

// Configuring the CtfEvents module
angular.module('ctfEvents').run(['Menus',
  function (Menus) {
    // Add the ctfEvents dropdown item
    Menus.addMenuItem('topbar', {
      title: 'CtfEvents',
      state: 'ctfEvents',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'ctfEvents', {
      title: 'List CtfEvents',
      state: 'ctfEvents.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'ctfEvents', {
      title: 'Create CtfEvents',
      state: 'ctfEvents.create',
      roles: ['user']
    });
  }
]);

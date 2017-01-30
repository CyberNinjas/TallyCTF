'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin'],
      position: 4
    });

    /**
     * The challenge module was being initialized prior to Admin drop down
     * so this configuration had to be added here to circumvent ordering issues
    **/
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Challenges',
      state: 'challenges.create'
    })
  }
]);

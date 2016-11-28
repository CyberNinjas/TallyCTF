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

    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Challenges',
      state: 'challenges.create'
    })
  }
]);

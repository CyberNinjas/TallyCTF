'use strict';

// Configuring the Challengeboards module
angular.module('challengeboards').run(['Menus',
  function (Menus) {
    // Add the challengeboards dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Challengeboards',
      state: 'challengeboards',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'challengeboards', {
      title: 'List Challengeboards',
      state: 'challengeboards.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'challengeboards', {
      title: 'Create Challengeboards',
      state: 'challengeboards.create',
      roles: ['user']
    });
  }
]);

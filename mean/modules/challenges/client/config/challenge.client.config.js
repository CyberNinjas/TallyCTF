'use strict';

// Configuring the Challenges module
angular.module('challenges').run(['Menus',
  function (Menus) {
    // Add the challenges dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Challenges',
      state: 'challenges',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'challenges', {
      title: 'List Challenges',
      state: 'challenges.list'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'teamCaptainMenu', {
      title: 'teamCaptaineering',
      state: 'challenges.list',
      roles: ['teamCaptain']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'challenges', {
      title: 'Create Challenges',
      state: 'challenges.create',
      roles: ['admin']
    });
  }
]);

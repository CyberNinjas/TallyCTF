'use strict';

// Configuring the ScoreBoard module
angular.module('challenges').run(['Menus',
  function (Menus) {

    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'List Challenges',
      state: 'challenges.list',
      position: 6
    });

    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Create Challenges',
      state: 'challenges.create',
      position: 5
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'teamCaptainMenu', {
      title: 'teamCaptaineering',
      state: 'challenges.list',
      roles: ['teamCaptain']
    });

  }
]);

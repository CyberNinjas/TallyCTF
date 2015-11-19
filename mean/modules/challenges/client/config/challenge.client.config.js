'use strict';

// Configuring the ScoreBoard module
angular.module('challenges').run(['Menus',
  function (Menus) {
    // Add the scoreBoard dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Challenges',
      state: 'challenges.list',
      roles: ['*']
    });
  }
]);

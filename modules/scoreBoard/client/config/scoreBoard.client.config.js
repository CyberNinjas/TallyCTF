'use strict';

// Configuring the ScoreBoard module
angular.module('scoreBoard').run(['Menus',
  function (Menus) {
    // Add the scoreBoard dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Score Board',
      state: 'scoreBoard.list',
      roles: ['*']
    });
  }
]);

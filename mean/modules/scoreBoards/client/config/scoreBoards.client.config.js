'use strict';

// Configuring the ScoreBoards module
angular.module('scoreBoards').run(['Menus',
  function (Menus) {
    // Add the scoreBoards dropdown item
    Menus.addMenuItem('topbar', {
      title: 'ScoreBoards',
      state: 'scoreBoards',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'scoreBoards', {
      title: 'List ScoreBoards',
      state: 'scoreBoards.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'scoreBoards', {
      title: 'Create ScoreBoards',
      state: 'scoreBoards.create',
      roles: ['user']
    });
  }
]);

'use strict';
angular.module('teams').run(['Menus', 'Authentication',
  function(Menus, Authentication) {
    // Add the teams dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Teams',
      state: 'teams.list',
      roles: ['*']
    });
  }
]);

'use strict';

angular.module('teams')
  .run(['Menus', 'Authentication',
    function (Menus, Authentication) {
      Menus.addMenuItem('topbar', {
        title: 'Teams',
        state: 'teams.list',
        roles: ['*']
      });
    }
  ]);

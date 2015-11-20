'use strict';

// Configuring the Teams module
angular.module('teams').run(['Menus','Authentication',
  function (Menus, Authentication) {
    // Add the teams dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Teams',
      state: 'teams',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'teams', {
      title: 'List Teams',
      state: 'teams.list'
    });

    // Add the dropdown create item
    if(Authentication.user.roles.indexOf('teamMember') > -1) {
      Menus.addSubMenuItem('topbar', 'teams', {
        title: 'Create Teams',
        state: 'teams.create',
        roles: ['user']
      });
    }
  }
]);

'use strict';

// Add the user auths menu to the admin dropdown
angular.module('userAuths').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage User Auths',
      state: 'userAuths.list'
    });
  }
]);

'use strict'

angular.module('ctfEvents').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Events',
      state: 'ctfEvents.upcoming',
      roles: ['*']
    })

    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Events',
      state: 'ctfEvents.list',
    })
  }
])

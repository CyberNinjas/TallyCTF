'use strict'

angular.module('challenges').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Challenges',
      state: 'challenges.list',
      roles: ['admin']
    })
  }
])

'use strict'

angular.module('challenges').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    .state('challenges', {
      abstract: true,
      url: '/challenges',
      template: '<ui-view/>'
    })
    .state('challenges.list', {
      url: '',
      templateUrl: 'modules/challenges/client/views/list-challenges.client.view.html'
    })
    .state('challenges.create', {
      url: '/create',
      templateUrl: 'modules/challenges/client/views/create-edit-challenge.client.view.html',
      data: {
        roles: ['admin']
      }
    })
    .state('challenges.view', {
      url: '/:challengeId',
      templateUrl: 'modules/challenges/client/views/view-challenges.client.view.html'
    })
    .state('challenges.edit', {
      url: '/:challengeId/edit',
      templateUrl: 'modules/challenges/client/views/create-edit-challenge.client.view.html',
      data: {
        roles: ['admin']
      }
    })
  }
])

'use strict';

// Setting up route
angular.module('challenges').config(['$stateProvider',
  function ($stateProvider) {
    // Challenges state routing
  $stateProvider
    .state('challenges', {
      abstract: true,
      url: '/challenges',
      template: '<ui-view/>'
    })
    // Register list state
    .state('challenges.list', {
      url: '',
      templateUrl: 'modules/challenges/client/views/list-challenges.client.view.html'
    })
    // Register create state. Admin use only
    .state('challenges.create', {
      url: '/create',
      templateUrl: 'modules/challenges/client/views/create-edit-challenge.client.view.html',
      data: {
        roles: ['admin']
      }
    })
    // Register view state
    .state('challenges.view', {
      url: '/:challengeId',
      templateUrl: 'modules/challenges/client/views/view-challenges.client.view.html'
    })
    // Register edit state. Admin use only
    .state('challenges.edit', {
      url: '/:challengeId/edit',
      templateUrl: 'modules/challenges/client/views/create-edit-challenge.client.view.html',
      data: {
        roles: ['admin']
      }
    });
  }
]);

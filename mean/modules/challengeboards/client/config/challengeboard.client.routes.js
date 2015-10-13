'use strict';

// Setting up route
angular.module('challengeboards').config(['$stateProvider',
  function ($stateProvider) {
    // Challengeboards state routing
    $stateProvider
      .state('challengeboards', {
        abstract: true,
        url: '/challengeboards',
        template: '<ui-view/>'
      })
      .state('challengeboards.list', {
        url: '',
        templateUrl: 'modules/challengeboards/client/views/list-challengeboards.client.view.html'
      })
      .state('challengeboards.create', {
        url: '/create',
        templateUrl: 'modules/challengeboards/client/views/create-challengeboards.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('challengeboards.view', {
        url: '/:challengeboardId',
        templateUrl: 'modules/challengeboards/client/views/view-challengeboards.client.view.html'
      })
      .state('challengeboards.edit', {
        url: '/:challengeboardId/edit',
        templateUrl: 'modules/challengeboards/client/views/edit-challengeboards.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

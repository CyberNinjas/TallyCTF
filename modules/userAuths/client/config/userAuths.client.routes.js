'use strict';

// Setting up route
angular.module('userAuths').config(['$stateProvider',
  function ($stateProvider) {
    // User Auths state routing
    $stateProvider
      .state('userAuths', {
        abstract: true,
        url: '/admin/userAuths',
        template: '<ui-view/>'
      })
      .state('userAuths.list', {
        url: '',
        templateUrl: 'modules/userAuths/client/views/list-userAuths.client.view.html'
      })
      .state('userAuths.create', {
        url: '/create',
        templateUrl: 'modules/userAuths/client/views/create-userAuth.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('userAuths.view', {
        url: '/:userAuthId',
        templateUrl: 'modules/userAuths/client/views/view-userAuth.client.view.html'
      })
      .state('userAuths.edit', {
        url: '/:userAuthId/edit',
        templateUrl: 'modules/userAuths/client/views/edit-userAuth.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);

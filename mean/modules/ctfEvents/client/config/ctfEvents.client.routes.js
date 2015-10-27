'use strict';

// Setting up route
angular.module('ctfEvents').config(['$stateProvider',
  function ($stateProvider) {
    // CtfEvents state routing
    $stateProvider
      .state('ctfEvents', {
        abstract: true,
        url: '/ctfEvents',
        template: '<ui-view/>'
      })
      .state('ctfEvents.list', {
        url: '',
        templateUrl: 'modules/ctfEvents/client/views/list-ctfEvents.client.view.html'
      })
      .state('ctfEvents.create', {
        url: '/create',
        templateUrl: 'modules/ctfEvents/client/views/create-ctfEvent.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('ctfEvents.view', {
        url: '/:ctfEventId',
        templateUrl: 'modules/ctfEvents/client/views/view-ctfEvent.client.view.html'
      })
      .state('ctfEvents.edit', {
        url: '/:ctfEventId/edit',
        templateUrl: 'modules/ctfEvents/client/views/edit-ctfEvent.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

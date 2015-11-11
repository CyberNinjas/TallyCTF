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
        templateUrl: 'modules/ctfEvents/client/views/list-ctfEvents.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('ctfEvents.create', {
        url: '/create',
        templateUrl: 'modules/ctfEvents/client/views/create-ctfEvent.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('ctfEvents.current', {
        url: '/current',
        templateUrl: 'modules/ctfEvents/client/views/edit-current-ctfEvent.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('ctfEvents.edit', {
        url: '/:ctfEventId',
        templateUrl: 'modules/ctfEvents/client/views/edit-ctfEvent.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);

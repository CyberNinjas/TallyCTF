'use strict';

// Setting up route
angular.module('ctfEvents').config(['$stateProvider',
  function ($stateProvider) {
    // CtfEvents state routing
    // All ctfEvent states restricted to Admin view only!
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
      .state('ctfEvents.upcoming', {
        url: '/upcoming',
        templateUrl: 'modules/ctfEvents/client/views/upcoming-events-ctfEvents.client.view.html',
        data: {
          roles: ['user']
        }
      })
      .state('ctfEvents.dashboard', {
        url: '/dash/:ctfEventId',
        templateUrl: 'modules/ctfEvents/client/views/dashboard-ctfEvents.client.view.html',
        data: {
          roles: ['user']
        }
      })
      .state('ctfEvents.registration', {
        url: '/register/:ctfEventId',
        templateUrl: 'modules/ctfEvents/client/views/team-registration-ctfEvent.client.view.html',
        data: {
          roles: ['user']
        }
      })
      .state('ctfEvents.create', {
        url: '/create',
        templateUrl: 'modules/ctfEvents/client/views/create-ctfEvent.client.view.html',
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

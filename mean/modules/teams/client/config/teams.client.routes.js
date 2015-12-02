'use strict';

// Setting up route
angular.module('teams').config(['$stateProvider',
  function ($stateProvider) {
    // Teams state routing
    $stateProvider
      .state('teams', {
        abstract: true,
        url: '/teams',
        template: '<ui-view/>'
      })

      .state('teams.list', {
        url: '',
        templateUrl: 'modules/teams/client/views/list-teams.client.view.html'
      })
      .state('teams.current', {
        url: '/current',
        templateUrl: 'modules/teams/client/views/list-current.client.view.html',
        data: {
          roles: ['user']
        }
      })
      .state('teams.add',{
        url:'/addusers',
        templateUrl: 'modules/teams/client/views/add.users.html',
        data: {
          roles: ['teamCaptain', 'admin']
        }
      })
      .state('teams.create', {
        url: '/create',
        templateUrl: 'modules/teams/client/views/create-team.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('teams.view', {
        url: '/:teamId',
        templateUrl: 'modules/teams/client/views/view-team.client.view.html'
      })
      .state('teams.edit', {
        url: '/:teamId/edit',
        templateUrl: 'modules/teams/client/views/edit-team.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

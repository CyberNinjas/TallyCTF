'use strict';
angular.module('teams')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider.state('teams', {
        abstract: true,
        url: '/teams',
        template: '<ui-view/>'
      })
      .state('teams.list', {
        url: '',
        templateUrl: 'modules/teams/client/views/teams.list.client.view.html',
        data: {
          roles: ['user', 'teamCaptain', 'admin']
        }
      })
      .state('teams.dashboard', {
        url: '/teams/dashboard',
        templateUrl: 'modules/teams/client/views/teams.dashboard.client.view.html',
        data: {
          roles: ['user']
        }
      })
      .state('teams.add', {
        url: '/addUsers/:teamId',
        templateUrl: 'modules/teams/client/views/teams.requests.client.view.html',
        data: {
          roles: ['teamCaptain', 'admin']
        }
      })
      .state('teams.create', {
        url: '/create',
        templateUrl: 'modules/teams/client/views/teams.create.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('teams.view', {
        url: '/:teamId',
        templateUrl: 'modules/teams/client/views/teams.view.client.view.html'
      })
      .state('teams.edit', {
        url: '/:teamId/edit',
        templateUrl: 'modules/teams/client/views/teams.edit.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
    }
  ]);

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
      //route for list of all registered teams view
      .state('teams.list', {
        url: '',
        templateUrl: 'modules/teams/client/views/list-teams.client.view.html'
      })
      //route for viewing team requests and asks* for a user *semantics described in team.server.model.js
      .state('teams.current', {
        url: '/current',
        templateUrl: 'modules/teams/client/views/list-current.client.view.html',
        data: {
          roles: ['user']
        }
      })
        //route for adding users view
      .state('teams.add',{
        url:'/addUsers',
        templateUrl: 'modules/teams/client/views/add.users.html',
        data: {
          roles: ['teamCaptain', 'admin']
        }
      })
        //route for creating a team view
      .state('teams.create', {
        url: '/create',
        templateUrl: 'modules/teams/client/views/create-team.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
        //route for current user's team view
      .state('teams.view', {
        url: '/:teamId',
        templateUrl: 'modules/teams/client/views/view-team.client.view.html'
      })
        //route for editing team (teamCaptain and admin) view
      .state('teams.edit', {
        url: '/:teamId/edit',
        templateUrl: 'modules/teams/client/views/edit-team.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

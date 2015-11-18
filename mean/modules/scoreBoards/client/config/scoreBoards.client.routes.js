'use strict';

// Setting up route
angular.module('scoreBoards').config(['$stateProvider',
  function ($stateProvider) {
    // ScoreBoards state routing
    $stateProvider
      .state('scoreBoards', {
        abstract: true,
        url: '/scoreBoards',
        template: '<ui-view/>'
      })
      .state('scoreBoards.list', {
        url: '',
        templateUrl: 'modules/scoreBoards/client/views/list-scoreBoards.client.view.html'
      })
      .state('scoreBoards.create', {
        url: '/create',
        templateUrl: 'modules/scoreBoards/client/views/create-scoreBoard.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('scoreBoards.view', {
        url: '/:scoreBoardId',
        templateUrl: 'modules/scoreBoards/client/views/view-scoreBoard.client.view.html'
      })
      .state('scoreBoards.edit', {
        url: '/:scoreBoardId/edit',
        templateUrl: 'modules/scoreBoards/client/views/edit-scoreBoard.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

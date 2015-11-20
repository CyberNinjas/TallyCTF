'use strict';

// Setting up route
angular.module('scoreBoard').config(['$stateProvider',
  function ($stateProvider) {
    // ScoreBoard state routing
    $stateProvider
      .state('scoreBoard', {
        abstract: true,
        url: '/scoreBoard',
        template: '<ui-view/>'
      })
      .state('scoreBoard.list', {
        url: '',
        templateUrl: 'modules/scoreBoard/client/views/list-scoreBoard.client.view.html'
      })
      .state('scoreBoard.view', {
        url: '/:scoreBoardTeamId',
        templateUrl: 'modules/scoreBoard/client/views/view-scoreBoard.client.view.html'
      })
      .state('scoreBoard.edit', {
        url: '/:scoreBoardTeamId/edit',
        templateUrl: 'modules/scoreBoard/client/views/edit-scoreBoard.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);

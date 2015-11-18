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
        url: '/:scoreBoardId',
        templateUrl: 'modules/scoreBoard/client/views/view-scoreBoard.client.view.html'
      });
  }
]);

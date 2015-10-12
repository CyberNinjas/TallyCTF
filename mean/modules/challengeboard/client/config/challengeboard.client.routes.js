'use strict';

// Setting up route
angular.module('challengeboard').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('challengeboard', {
        abstract: true,
        url: '/challengeboard',
        template: '<ui-view/>'
      });
    }
  ]);

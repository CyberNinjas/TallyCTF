'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

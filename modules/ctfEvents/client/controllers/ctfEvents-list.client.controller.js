'use strict';

angular.module('ctfEvents').controller('ListEventsController', ['$scope','$stateParams', '$location', 'Authentication',
  'CtfEvents', function ($scope, $stateParams, $location, Authentication,
                                                                             CtfEvents) {

    $scope.authentication = Authentication;
    $scope.ctfEvents = CtfEvents.query();
  }
]);

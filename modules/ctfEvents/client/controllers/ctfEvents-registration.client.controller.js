'use strict';

angular.module('ctfEvents').controller('EventRegistrationController', ['$scope', '$filter','$stateParams', '$location', 'Authentication',
  'CtfEvents', 'Challenges', 'Teams', 'Users', function ($scope, $filter, $stateParams, $location, Authentication,
                                                         CtfEvents, Challenges, Teams, Users) {
    $scope.authentication = Authentication;
    $scope.ctfEvent = CtfEvents.get({ ctfEventId: $stateParams.ctfEventId })
    $scope.ctfEvent.$promise.then(function(data) {
      $scope.teams = Teams.query();
      $scope.teams.$promise.then(function(data) {
        $scope.users = Users.query();
        $scope.users.$promise.then(function(data) {
          $scope.eventTeams = $filter('selected')($scope.teams, $scope.ctfEvent.teams);
          $scope.eventUsers= $filter('selected')($scope.users, $scope.ctfEvent.users);
          $scope.roles = $scope.authentication.user.roles;
        });
      });
    });
  }
]);

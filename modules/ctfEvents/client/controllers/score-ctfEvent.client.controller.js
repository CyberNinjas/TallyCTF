'use strict';
angular.module('ctfEvents').controller('ScoreController', ['$scope','$state', '$filter', '$stateParams', '$location', '$q', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', function($scope, $state, $filter, $stateParams, $location, $q, Authentication, CtfEvents, Challenges, Teams, Users) {
  $scope.authentication = Authentication;
  $q.all([
    Users.query().$promise,
    Challenges.query().$promise,
    Teams.query().$promise,
    CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise
  ]).then(function(data) {
    $scope.users = data[0];
    $scope.challenges = data[1];
    $scope.teams = data[2];
    $scope.ctfEvent = data[3];
    return
  }).then(function() {
    $scope.eventId = $stateParams.ctfEventId
    $scope.eventTeams = $filter('memberTeams')($scope.teams, $scope.ctfEvent.teams);
    $scope.eventChallenges = $filter('filter')($scope.challenges, $scope.ctfEvent.challenges);
  });

  $scope.getTeamName = function(team) {
    return $filter('filter')($scope.teams, { _id: team.id })[0].teamName;
  }
}]);

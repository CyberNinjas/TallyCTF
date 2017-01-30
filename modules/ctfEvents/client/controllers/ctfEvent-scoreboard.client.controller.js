'use strict';
angular.module('ctfEvents').controller('ScoreController', ['$scope', '$filter',
  '$stateParams', '$q', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users',
  function ($scope, $filter, $stateParams, $q, Authentication, CtfEvents, Challenges, Teams, Users) {

    $scope.authentication = Authentication;

    /**
     * Once the teams object is filtered so that it only includes the teams that are
     * registered in the event we add the score element that's generated server side
     * to the remaining team objects so that we have both the team name and scoring
     * information in a single object
     */
    $q.all([
      Users.query().$promise,
      Challenges.query().$promise,
      Teams.query().$promise,
      CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise
    ]).then(function (data) {
      $scope.users = data[0];
      $scope.challenges = data[1];
      $scope.teams = data[2];
      $scope.ctfEvent = data[3];
      return
    }).then(function () {
      $scope.eventId = $stateParams.ctfEventId
      $scope.eventTeams = $filter('memberTeams')($scope.teams, $scope.ctfEvent.teams);
      $scope.eventChallenges = $filter('filter')($scope.challenges, $scope.ctfEvent.challenges);
      angular.forEach($scope.eventTeams, function (team) {
        angular.forEach($scope.ctfEvent.score, function (eventTeam) {
          if(eventTeam.team === team._id){
            team.points = eventTeam.score
          }
        })
      })
    });
  }]);

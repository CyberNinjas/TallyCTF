'use strict';
angular.module('ctfEvents').controller('ScoreController', ['$scope', '$controller', '$filter',
  '$stateParams', '$q', 'Authentication', 'CtfEvents',
  function ($scope, $controller, $filter, $stateParams, $q, Authentication, CtfEvents) {

    $controller('BaseEventsController', {
      $scope: $scope
    });

    /**
     * Once the teams object is filtered so that it only includes the teams that are
     * registered in the event we add the score element that's generated server side
     * to the remaining team objects so that we have both the team name and scoring
     * information in a single object
     */
    $scope.all.then(function () {
      CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise.then(function (data) {
        $scope.ctfEvent = data;
        $scope.eventTeams = $filter('memberTeams')($scope.teams, $scope.ctfEvent.teams);
        $scope.eventChallenges = $filter('filter')($scope.challenges, $scope.ctfEvent.challenges);
        angular.forEach($scope.eventTeams, function (team) {
          angular.forEach($scope.ctfEvent.score, function (eventTeam) {
            if (eventTeam.team === team._id) {
              team.points = eventTeam.score
            }
          })
        })
      })
    })
  }]);

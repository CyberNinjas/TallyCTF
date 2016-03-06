'use strict';

angular.module('ctfEvents').controller('DashboardController', ['$scope', '$filter','$stateParams', '$location', 'Authentication',
  'CtfEvents', 'Challenges', 'Teams', 'Users', function ($scope, $filter, $stateParams, $location, Authentication,
                                                         CtfEvents, Challenges, Teams, Users) {

    $scope.authentication = Authentication;

    // Each query is nested in the previous one's promise to make sure
    // everything resolves before we set each of the select's options
    $scope.ctfEvent = CtfEvents.get({ ctfEventId: $stateParams.ctfEventId })
    $scope.ctfEvent.$promise.then(function(data) {
      $scope.challenges = Challenges.query();
      $scope.challenges.$promise.then(function(data) {
        $scope.teams = Teams.query();
        $scope.teams.$promise.then(function(data) {
          //$scope.scoreBoard= scoreBoard.get();
          //$scope.scoreBoard.$promise.then(function(data) {
          $scope.eventTeams = $filter('selected')($scope.teams, $scope.ctfEvent.teams);
          $scope.eventChallenges = $filter('selected')($scope.challenges, $scope.ctfEvent.challenges);
          $scope.eventId = $stateParams.ctfEventId

          $scope.ongoing = $scope.isOngoing()
          $scope.getRemainingTime()
          $scope.remainingTime = $scope.ongoing === false ? '00:00:00' : $scope.hours + ':' + $scope.minutes

          $scope.tile_stats = [
            { title: 'Your Position',
              value: $scope.ongoing === false ? 'N/A' : '1st',
              change: $scope.ongoing === false ? null : 0,
              icon: 'fa fa-sort-numeric-asc'
            },
            { title: 'Points Available:',
              value: $scope.ongoing === false ? 0 : $scope.getPointTotal(),
              change: null,
              icon: 'fa fa-diamond'
            },
            { title: 'Your Point Total ',
              value: $scope.ongoing === false ? 0 : 0,
              change: $scope.ongoing === false ? null : 0,
              icon: 'fa fa-bullseye'
            },
            { title: 'Points Behind 1st',
              value: $scope.ongoing === false ? 0 : 0,
              change: $scope.ongoing === false ? null : 0,
              icon: 'fa fa-thumbs-o-down'
            }
          ]
          //});
        });
      });
    });

    $scope.getPointTotal = function(){
      var pointTotal = $scope.eventChallenges.reduce(function(total, challenge){
        return total + challenge.points;
      }, 0);
      return pointTotal
    }

    $scope.isOngoing = function(){
      var hasStarted = $scope.ctfEvent.start < moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
               && moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') < $scope.ctfEvent.end
      return hasStarted
    }

    $scope.getRemainingTime = function(){
      var duration = moment.duration(moment($scope.ctfEvent.end).diff(moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')))
      var milliseconds = duration._milliseconds; milliseconds = Math.floor(milliseconds/1000);
      $scope.seconds = (milliseconds % 60); milliseconds = Math.floor(milliseconds/60);
      $scope.minutes = (milliseconds % 60); milliseconds = Math.floor(milliseconds/60);
      $scope.hours = milliseconds ;
    }

    $scope.getUserName = function(id){
      var user = Users.get({ userId : id });
      console.log(user.firstName)
    }
  }]);

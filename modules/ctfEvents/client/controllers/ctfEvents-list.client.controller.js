'use strict';
angular.module('ctfEvents').controller('ListEventsController', ['$state', '$scope', '$stateParams', '$location', '$filter', '$q', 'Teams', 'Authentication', 'CtfEvents', 'captainsTeamsService', 'ModalService', function ($state, $scope, $stateParams, $location, $filter, $q, Teams, Authentication, CtfEvents, captainsTeamsService, ModalService) {
  $scope.authentication = Authentication;
  $scope.userId = $scope.authentication.user._id
  $scope.ctfEvents = CtfEvents.query();
  $scope.isRegistered = function (ctfEvent) {
    // hack: must return a non-empty string
    return ctfEvent.users.indexOf($scope.userId) > -1 ? 'ctfEvents.dashboard({ ctfEventId : ctfEvent._id })' : '-'
  }
  $scope.registerForEvent = function (eventId) {
    var ctfEvent = CtfEvents.get({
      ctfEventId: eventId
    })
    ctfEvent.$promise.then(function (data) {
      ctfEvent.users.push($scope.userId)
      if($scope.authentication.user.roles.indexOf('teamCaptain') > -1) {
        var teamId = $scope.authentication.user.team
        var team = $scope.show(ctfEvent)
      } else {
        ctfEvent.$update(function () {
          console.log(ctfEvent)
          $location.path('ctfEvents/dash/' + ctfEvent._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    })
  };
  $scope.show = function (ctfEvent) {
    $scope.teams = Teams.query();
    $scope.teams.$promise.then(function (data) {
      //var probables = $filter('captainsTeams')($scope.teams, $scope.authentication.user.team)
      for(var team = 0; team < $scope.teams.length; team++) {
        if($scope.teams[team].teamCaptain === $scope.userId) {
          captainsTeamsService.addTeam($scope.teams[team])
        }
      }
      ModalService.showModal({
        templateUrl: 'modal.html',
        controller: 'ModalController'
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          console.log(result)
          captainsTeamsService.resetTeams()
          if(result.teamName !== 'None') {
            ctfEvent.teams.push({
              teamId: result.teamId,
              users: [$scope.userId]
            })
          }
          ctfEvent.$update(function () {
            console.log(ctfEvent)
            $location.path('ctfEvents/dash/' + ctfEvent._id);
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        });
      });
    })
  };
}]);

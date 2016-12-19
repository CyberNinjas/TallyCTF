'use strict';
angular.module('ctfEvents').controller('ListEventsController', ['$state', '$scope', '$stateParams',
  '$location', '$filter', '$q', 'Teams', 'Authentication', 'CtfEvents', 'usersTeamsService', 'ModalService',
  function($state, $scope, $stateParams, $location, $filter, $q, Teams, Authentication, CtfEvents, usersTeamsService, ModalService) {

    $scope.userId = Authentication.user._id
    $scope.ctfEvents = CtfEvents.query();

    $scope.isRegistered = function(ctfEvent) {
      return ctfEvent.users.indexOf(Authentication.user._id) > -1 ? 'ctfEvents.dashboard({ ctfEventId : ctfEvent._id })' : '-'
    }

    $scope.registerForEvent = function(eventId) {
      var ctfEvent = CtfEvents.get({ ctfEventId: eventId })
      ctfEvent.$promise.then(function(data) {
        ctfEvent.users.push($scope.userId)
        if(Authentication.user.roles.indexOf('teamCaptain') > -1) {
          var team = $scope.show('captain', ctfEvent)
        } else if(Authentication.user.teams.length > 0) {
          var team = $scope.show('user', ctfEvent)
        } else {
          CtfEvents.update(ctfEvent, function() {
            $location.path('ctfEvents/dash/' + ctfEvent._id);
          }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
          })
        };
      })
    }

    $scope.show = function(userType, ctfEvent) {
      $scope.teams = Teams.query();
      $scope.teams.$promise.then(function(data) {
        if(userType === 'captain'){
          angular.forEach($scope.teams, function (team) {
            if(team.teamCaptain === $scope.userId) {
              usersTeamsService.addTeam(team)
            }
          })
          var templateUrl = 'captain.modal.html'
        } else if(userType === 'user'){
          angular.forEach($scope.teams, function (team) {
            if(team.members.indexOf($scope.userId) > 0) {
              usersTeamsService.addTeam(team)
            }
          })
          var templateUrl = 'member.modal.html'
        }
        ModalService.showModal({
          templateUrl: templateUrl,
          controller: 'ModalController'
        })
        .then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
            usersTeamsService.resetTeams()
            if(result.teamName !== 'None') {
              ctfEvent.teams.push({
                team: result._id,
                members: [Authentication.user._id]
              })
            }
            CtfEvents.update(ctfEvent, function() {
              $location.path('ctfEvents/dash/' + ctfEvent._id);
            }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
            });
          });
        });
      })
    };
  }
]);

'use strict';
angular.module('ctfEvents').controller('ListEventsController', ['$state', '$scope', '$stateParams',
  '$location', '$filter', '$q', 'Teams', 'Authentication', 'CtfEvents', 'usersTeamsService', 'ModalService', '$controller', 'Cache',
  function ($state, $scope, $stateParams, $location, $filter, $q, Teams, Authentication, CtfEvents, usersTeamsService, ModalService, $controller, Cache) {

    $controller('BaseEventsController', {
      $scope: $scope
    });

    /*
     * Determines whether or not a user is registered for an event
     */
    $scope.isRegistered = function (ctfEvent) {
      return ctfEvent.users.indexOf(Authentication.user._id) > -1 ? 'ctfEvents.dashboard({ ctfEventId : ctfEvent._id })' : '-'
    }

    /*
     * Determines whether or not a user can register for an event
     */
    $scope.canRegister = function (ctfEvent) {
      return ctfEvent.registrationStart < moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') && moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') < ctfEvent.registrationEnd
    }

    /*
     *  Gets the event object for the event that he user is attempting to register for
     *  and shows the user a modal for team selection based on their user roles
     */
    $scope.registerForEvent = function (eventId) {
      var ctfEvent = CtfEvents.get({ ctfEventId: eventId }).$promise
      ctfEvent.then(function (data) {
        data.users.push($scope.userId)
        if (Authentication.user.roles.indexOf('teamCaptain') > -1) {
          $scope.show('captain', data)
        } else if (Authentication.user.teams.length > 0) {
          $scope.show('user', data)
        } else {
          CtfEvents.update(data, function () {
            $scope.socket.emit('invalidate', { 'id': data._id })
            $location.path('ctfEvents/dash/' + data._id);
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          })
        }
        ;
      })
    }

    /*
     * Gathers all of the registering user's teams and creates and shows
     * a modal where the user can select the one (or none) they'd like to
     * register or join whether they're a captain or user respectively
     *
     * If the user selects a team then they're either added to the ctfEvents
     * team or the team is added to the event if they're a user or captain
     * respectively.
     */
    $scope.show = function (userType, ctfEvent) {
      $scope.teams = Teams.query();
      $scope.teams.$promise.then(function (data) {
        if (userType === 'captain') {
          angular.forEach($scope.teams, function (team) {
            if (team.teamCaptain === $scope.userId) {
              usersTeamsService.addTeam(team)
            }
          })
          var templateUrl = 'captain.modal.html'
        } else if (userType === 'user') {
          angular.forEach($scope.teams, function (team) {
            if (team.members.indexOf($scope.userId) > 0) {
              usersTeamsService.addTeam(team)
            }
          })
          var templateUrl = 'member.modal.html'
        }
        ModalService.showModal({
          templateUrl: templateUrl,
          controller: 'ModalController'
        })
          .then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
              usersTeamsService.resetTeams()
              if (result.teamName !== 'None') {
                ctfEvent.teams.push({
                  team: result._id,
                  members: [Authentication.user._id]
                })
              }
              CtfEvents.update(ctfEvent, function () {
                $scope.socket.emit('invalidateAll')
                $location.path('ctfEvents/dash/' + ctfEvent._id);
              }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
              });
            });
          });
      })
    };
  }
]);

'use strict';
angular.module('ctfEvents').controller('UpdateEventsController', ['$scope', '$filter', '$stateParams', '$location', '$q', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', function ($scope, $filter, $stateParams, $location, $q, Authentication, CtfEvents, Challenges, Teams, Users) {
  $q.all([
    Users.query().$promise,
    Challenges.query().$promise,
    Teams.query().$promise,
    CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }),
  ]).then(function (data) {
    $scope.users = data[0];
    $scope.challenges = data[1];
    $scope.teams = data[2];
    $scope.ctfEvent = data[3];
    return
  }).then(function () {
    $scope.teamOptions = {
      title: 'Teams',
      display: 'teamName',
      items: $filter('unselectedTeam')($scope.teams, $scope.ctfEvent.teams),
      selectedItems: $filter('selectedTeam')($scope.teams, $scope.ctfEvent.teams)
    };
    $scope.challengeOptions = {
      title: 'Challenges',
      display: 'name',
      items: $filter('unselected')($scope.challenges, $scope.ctfEvent.challenges),
      selectedItems: $filter('selected')($scope.challenges, $scope.ctfEvent.challenges)
    };
    $scope.userOptions = {
      title: 'Users',
      display: 'firstName',
      items: $filter('unselected')($scope.users, $scope.ctfEvent.users),
      selectedItems: $filter('selected')($scope.users, $scope.ctfEvent.users)
    };
  });

  $scope.remove = function (ctfEvent) {
    if (!confirm('Are you sure that you want to delete this event?')) return;
    if (ctfEvent) {
      CtfEvents.remove(ctfEvent, function (response) {})
      for (var i in $scope.ctfEvents) {
        if ($scope.ctfEvents[i] === ctfEvent) {
          $scope.ctfEvents.splice(i, 1);
        }
      }
    } else {
      CtfEvents.remove(ctfEvent, function (response) {
        $location.path('ctfEvents');
      });
    }
  };

  $scope.update = function (isValid) {
    $scope.error = null;
    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'ctfEventForm');
      return false;
    }
    var ctfEvent = $scope.ctfEvent;
    ctfEvent.challenges = $scope.challengeOptions.selectedItems.map(function (obj) {
      return obj._id
    })
    ctfEvent.users = $scope.userOptions.selectedItems.map(function (obj) {
      return obj._id
    })
    ctfEvent.teams = []
    var teams = $scope.teamOptions.selectedItems.map(function (obj) {
      var team_listing = Teams.get({
        teamId: String(obj._id)
      });
      team_listing.$promise.then(function (data) {
        var existingUsers = []
        var members = team_listing.members.map(function (member) {
          return member._id
        })
        for (var user = 0; user < ctfEvent.users.length; user++) {
          if (members.indexOf(ctfEvent.users[user]) > -1) {
            existingUsers.push(ctfEvent.users[user])
          }
        }
        var team = {
          teamId: team_listing._id,
          users: existingUsers
        }
        ctfEvent.teams.push(team)
        return team
      })
      team_listing.$promise.finally(function (data) {
        CtfEvents.update(ctfEvent, function () {
          $location.path('ctfEvents');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      })
    })
  };
}])

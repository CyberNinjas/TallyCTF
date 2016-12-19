'use strict';
angular.module('ctfEvents').controller('EventRegistrationController', ['$scope', '$filter', '$stateParams', '$state', '$location', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', 'Socket', '$q', function ($scope, $filter, $stateParams, $state, $location, Authentication, CtfEvents, Challenges, Teams, Users, Socket, $q) {
  $scope.authentication = Authentication;

  $q.all([
    Users.query().$promise,
    Challenges.query().$promise,
    Teams.query().$promise,
    CtfEvents.get({ctfEventId: $stateParams.ctfEventId}).$promise,
  ]).then(function (data) {
    $scope.users = data[0];
    $scope.challenges = data[1];
    $scope.teams = data[2];
    $scope.ctfEvent = data[3];
    return
  }).then(function () {
    $scope.authentication = Authentication.user;
    $scope.roles = $scope.authentication.roles;
    $scope.eventTeams = $filter('memberTeams')($scope.teams, $scope.ctfEvent.teams);
    $scope.userTeams = $filter('userTeams')($scope.eventTeams, $scope.authentication);
    $scope.eventUsers = $filter('selected')($scope.users, $scope.ctfEvent.users);
  });

  $scope.leaveTeam = function (id) {
    var currentUser = $filter('filter')($scope.users, {_id: Authentication.user._id})[0]
    currentUser.teams.splice(currentUser.teams.indexOf(id))
    Users.update(currentUser, function () {
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });

    var currentTeam = $filter('filter')($scope.teams, {_id: id})[0];
    var userId = currentTeam.members.indexOf(user._id)
    currentTeam.members.splice(userId, 1);
    Teams.update(currentTeam, function () {
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });

    angular.forEach($scope.ctfEvent.teams, function (team) {
      if (team.team === id) {
        var userId = team.members.indexOf(user._id);
        team.members.splice(userId, 1);
      }
    })

    CtfEvents.update($scope.ctfEvent, function () {
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  $scope.notOnEventTeam = function(currentTeam){
    var notOnTeam = false;
    angular.forEach($scope.ctfEvent.teams, function (team) {
      if (team.team === currentTeam._id) {
        if (team.members.indexOf(Authentication.user._id) < 0){
          notOnTeam = true;
        }
      }
    })
    return notOnTeam;
  }

  $scope.selectTeam = function (currentTeam) {
    var strippedTeams = []
    angular.forEach($scope.ctfEvent.teams, function (team) {
      var userId = team.members.indexOf(Authentication.user._id)
      if (userId > -1){
        team.members.splice(userId, 1);
      }
      if (team.team === currentTeam._id) {
        team.members.push(Authentication.user._id);
      }
      strippedTeams.push(team)
    })
    $scope.ctfEvent.teams = strippedTeams;
    CtfEvents.update($scope.ctfEvent, function () {
      $location.path('ctfEvents/dash/' + $scope.ctfEvent._id);
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  $scope.isCaptain = function (hideFromAdmin) {
    var team = $scope.team;
    hideFromAdmin = (hideFromAdmin ? hideFromAdmin : false);
    if (Authentication.user && team && team.$resolved) {
      if (Authentication.user.roles.indexOf('admin') === -1) {
        return (team.teamCaptain._id.toString() === Authentication.user._id.toString());
      } else {
        return (!hideFromAdmin || (team.teamCaptain._id.toString() === Authentication.user._id.toString()));
      }
    } else {
      return false;
    }
  };
}]);

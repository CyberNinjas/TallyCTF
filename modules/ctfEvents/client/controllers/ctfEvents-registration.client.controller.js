'use strict';
angular.module('ctfEvents').controller('EventRegistrationController', ['$scope', '$filter', '$stateParams', '$state', '$location', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', 'Socket', '$q', function ($scope, $filter, $stateParams, $state, $location, Authentication, CtfEvents, Challenges, Teams, Users, Socket, $q) {

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
  }).then(function(){
    $scope.eventTeams = $filter('selected')($scope.teams, $scope.ctfEvent.teams);
    $scope.eventUsers = $filter('selected')($scope.users, $scope.ctfEvent.users);
    $scope.authentication = Authentication.user;
    $scope.roles = $scope.authentication.user.roles;
  });

  if (!Socket.socket) {
    Socket.connect();
  }
  Socket.on('userUpdate', function (message) {
    if (!Authentication.user || message.recipients.indexOf(Authentication.user._id) === -1) {
      return;
    }
    switch (message.op) {
      case 'insert':
        if (!message.scopeField) break;
        var path = message.scopeField.split('.');
        var root = $scope;
        for (var i = 0; i < path.length; ++i) root = (root[path[i]] ? root[path[i]] : root);
        if (root) root.push(message.data);
        break;
      case 'insertTeam':
        if (!message.scopeField) break;
        path = message.scopeField.split('.');
        root = $scope;
        for (i = 0; i < path.length; ++i) root = (root[path[i]] ? root[path[i]] : root);
        if ($scope[root].indexOf(message.data)) $scope.team.members.push($scope[root].splice($scope[root].indexOf(message.data)));
        break;
      case 'remove':
        for (var j = 0; $scope[message.scopeField] && j < $scope[message.scopeField].length; ++j) {
          if ($scope[message.scopeField][j]._id.toString() === message.data.toString()) {
            $scope[message.scopeField].splice(j, 1);
            break;
          }
        }
        break;
      default:
        break;
    }
  });

  $scope.$on('$destroy', function () {
    Socket.removeListener('userUpdate');
  });

  $scope.remove = function (team) {
    if (team) {
      team.$remove();
      for (var i in $scope.teams) {
        if ($scope.teams[i] === team) {
          $scope.teams.splice(i, 1);
        }
      }
    } else {
      $scope.team.$remove(function (response) {
        var msg = {
          recipients: response.members,
          op: 'rmTeam'
        };
        Socket.emit('userUpdate', msg);
        $location.path('teams');
      });
    }
  };

  $scope.update = function (isValid) {
    $scope.error = null;
    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'teamForm');
      return false;
    }
    var team = $scope.team;
    team.$update(function () {
      $location.path('teams/' + team._id);
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };

  $scope.requestsToJoin = function (team) {
    Socket.emit('userUpdate', {
      recipients: [team.teamCaptain],
      op: 'insert',
      scopeField: 'team.joinRequestsFromUsers',
      data: {
        username: Authentication.user.username,
        _id: Authentication.user._id
      }
    });
    team.temp = Authentication.user._id;
  };

  $scope.addUser = function (user) {
    // WARNING: Some sort of (effective) validation should be made
    $scope.team.temp = user._id;
    for (var i = 0; i < $scope.users.length; ++i) {
      if ($scope.users[i]._id.toString() === user._id.toString()) {
        $scope.users.splice(i, 1);
        $scope.count--;
        break;
      }
    }
  };

  $scope.removeMember = function (user, index) {
    $scope.team.members.splice(index, 1);
    $scope.team.temp = user._id;
  };

  $scope.accept = function (usr, cond) {
    var user = (usr ? usr : Authentication.user);
    var team = (typeof cond === 'number' ? $scope.team : cond);
    if (Authentication.user.team) {
      var add = team.joinRequestsFromUsers.splice(cond, 1);
      team.members.push(add[0]);
      Socket.emit('userUpdate', {
        recipients: [user._id],
        op: 'insertTeam',
        scopeField: 'team.askToJoin',
        data: team._id
      });
    }
    team.temp = user._id;
  };

  $scope.decline = function (usr, index, tm) {
    var user = (usr ? usr : Authentication.user);
    var team = (tm ? tm : $scope.team);
    if (Authentication.user.team) {
      Socket.emit('userUpdate', {
        recipients: [user._id],
        op: 'remove',
        field: 'requestToJoin',
        scopeField: 'requestTeams',
        data: team._id
      });
      team.joinRequestsFromUsers.splice(index, 1);
    } else {
      $scope.askTeams.splice(index, 1);
    }
    team.temp = user._id;
  };

  $scope.find = function () {
    $scope.teams = Teams.query();
  };

  $scope.findOne = function () {
    $scope.team = Teams.get({
      teamId: $stateParams.teamId
    });
  };

  $scope.findTeam = function () {
    if (Authentication.user.team) {
      $state.go('teams.view', {
        teamId: Authentication.user.team
      });
    }
  };

  $scope.findAvailableUsers = function () {
    $scope.users = Users.listAvailableUsers();
    $scope.team = Teams.getRaw({
      teamId: Authentication.user.team
    });
    // For UI, have a count of how many users are available to choose from
    $scope.count = 0;
  };

  $scope.shouldRender = function (rle, usr) {
    var role = (typeof rle === 'string' ? [rle] : rle);
    var user = (usr ? usr : Authentication.user);
    if (role.indexOf('user') !== -1) {
      return (user)
    }
    for (var i = 0; i < role.length; ++i)
      if (user && user.roles.indexOf(role[i]) !== -1) return true;
  };

  $scope.shouldAdd = function (usr) {
    var user = (usr ? usr : Authentication.user);
    // Make sure that there is a user to check for / a team to check from!
    if (!user || !$scope.team.$resolved) return false;
    var inReq = ($scope.team.joinRequestsFromUsers.indexOf(user._id) !== -1);
    var inAsk = ($scope.team.askToJoin.indexOf(user._id) !== -1);
    if (inReq || inAsk) return false;
    // Increment the count of how many available users there are
    $scope.count += 1;
    return true;
  };

  $scope.shouldReq = function (team) {
    var user = Authentication.user;
    // Make sure that there is a user to check for / a team to check from!
    if (!user || !team) return false;
    var inReq = (team.joinRequestsFromUsers.indexOf(user._id) !== -1);
    var inAsk = (team.joinRequestsToUsers.indexOf(user._id) !== -1);
    var isCaptain = (team.teamCaptain === user._id);
    if (inReq || inAsk || isCaptain) return false;
    // Increment the count of how many available users there are
    $scope.count += 1;
    return true;
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

  $scope.confirmDelete = function () {
    if (confirm('Are you sure you want to delete?')) $scope.remove();
  };
}]);

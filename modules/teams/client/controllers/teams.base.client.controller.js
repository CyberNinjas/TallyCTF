'use strict'
angular.module('teams')
  .controller('BaseTeamsController', ['$scope', 'Teams', 'Authentication', 'Users', 'Socket', 'Cache', 'CacheFactory', 'CtfEvents',
    function ($scope, Teams, Authentication, Users, Socket, Cache, CacheFactory, CtfEvents) {

      $scope.authentication = Authentication.user;
      $scope.users = Users.query();
      $scope.teams = Teams.query();
      $scope.socket = Socket
      $scope.socket.connect()

      /**
       * Pushes an object for a new team to users that haven't made a resource call since
       * its creation. Members and requests are set to empty so that the user can request
       * membership immediately.
       */
      $scope.socket.on('newTeam', function (message) {
        if ($scope.teams.indexOf(message.newTeam) < 0) {
          $scope.teams.push({
            teamName: message.newTeam.teamName,
            members: [],
            joinRequestsToUsers: [],
            joinRequestsFromUsers: []
          })
        }
      });

      /**
       * Immediately removes any team from the teams object when it is deleted.
       */
      $scope.socket.on('deleteTeam', function (message) {
        $scope.teams = $scope.teams.filter(function (team) {
          if (team.teamName !== message.team.teamName) {
            return team
          }
        })
      });

      /**
       * When a user requests to join a team this function finds the
       * correct user and team and then adds the user to the team's request
       * object and the team to the user's requests.
       */
      $scope.socket.on('insertRequest', function (message) {
        angular.forEach($scope.teams, function (team) {
          if (team._id === message.team){
            team.joinRequestsFromUsers.push(message._id)
          }
        })
        angular.forEach($scope.users, function (user) {
          if (user._id === message._id) {
            user.joinRequestsFromUsers.push(message._id);
          }
        })
      });

      /**
       * In the case that a teamCaptain accepts a users request this function
       * finds the team that the user has been added to and the user that has
       * been accepted. The user is added to the team's members object and the
       * team is added to the user's teams object.
       */
      $scope.socket.on('acceptUser', function (message) {
        angular.forEach($scope.teams, function (team) {
          if (team._id === message.data) {
            team.members.push(message.user._id)
          }
        })
        angular.forEach($scope.users, function (user) {
          if (user._id === message.user._id) {
            user.teams.push(message.data)
          }
        })
      });

      /**
       * In the case that a teamCaptain declines a user's request this function
       * finds the team that the user has been added to and the user that has
       * been accepted. The user is removed from the team's requests object and
       * the team is removed from the user's requests.
       */
      $scope.socket.on('declineUser', function (message) {
        angular.forEach($scope.teams, function (team) {
          if (team._id === message.data) {
            team.joinRequestsFromUsers.splice(team.joinRequestsFromUsers.indexOf(message.user._id))
          }
        });

        angular.forEach($scope.users, function (user) {
          if (user._id === message.user._id) {
            user.requestedToJoin.splice(user.requestedToJoin.indexOf(message.data))
          }
        })
      });

      $scope.socket.on('invalidate', function (id) {
        Cache.invalidate('api/ctfEvents/' + id);
        CtfEvents.query().$promise.then(function (data) {
          $scope.ctfEvents = data;
        })
      });

      $scope.socket.on('invalidateAll', function () {
        Cache.invalidateAll()
        CtfEvents.query().$promise.then(function (data) {
          $scope.ctfEvents = data;
        })
      });

      $scope.$on('$destroy', function () {
        $scope.socket.removeListener('newTeam');
        $scope.socket.removeListener('deleteTeam');
        $scope.socket.removeListener('acceptUser');
        $scope.socket.removeListener('declineUser');
        $scope.socket.removeListener('insertRequest');
        $scope.socket.removeListener('invalidate');
        $scope.socket.removeListener('invalidateAll');
      });
    }
  ]);

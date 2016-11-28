'use strict'
angular.module('teams')
  .controller('BaseTeamsController', ['$scope', 'Teams', 'Authentication', 'Users', 'Socket',
    function ($scope, Teams, Authentication, Users, Socket) {

      $scope.authentication = Authentication.user;
      console.log($scope.authentication)
      $scope.users = Users.query();
      $scope.teams = Teams.query();
      $scope.socket = Socket
      $scope.socket.connect()

      $scope.socket.on('newTeam', function (message) {
        message.newTeam.joinRequestsToUsers = []
        message.newTeam.joinRequestsFromUsers= []
        if($scope.teams.indexOf(message.newTeam) < 0){
          $scope.teams.push(message.newTeam)
        }
      });

      $scope.socket.on('deleteTeam', function (message) {
        $scope.teams = $scope.teams.filter(function(team){
          if(team.teamName !== message.team.teamName){
            return team
          }
        })
      });

      $scope.socket.on('insertRequest', function (message) {
        angular.forEach($scope.teams, function (team) {
          if (team._id === message.team) {
            team.joinRequestsFromUsers.push(message._id);
            angular.forEach($scope.users, function(user){
              if (user._id === message._id) {
                user.requestedToJoin.push(team._id)
              }
            })
          }
        })
      });

      $scope.socket.on('acceptUser', function (message) {
        angular.forEach($scope.teams, function (team) {
          if (team._id === message.data) {
            team.members.push(message.user._id)
            angular.forEach($scope.users, function(user){
              if (user._id === message.user._id) {
                user.team.push(team._id)
              }
            })
          }
        })
      });

      $scope.socket.on('declineUser', function (message) {
        angular.forEach($scope.teams, function (team) {
          if (team._id === message.data) {
            team.joinRequestsFromUsers.splice(team.joinRequestsFromUsers.indexOf(message.user._id))
            angular.forEach($scope.users, function(user){
              if (user._id === message.user._id) {
                user.requestedToJoin.splice(user.requestedToJoin.indexOf(message.data))
              }
            })
          }
        });
      });

      $scope.$on('$destroy', function () {
        $scope.socket.removeListener('newTeam');
        $scope.socket.removeListener('deleteTeam');
        $scope.socket.removeListener('acceptUser');
        $scope.socket.removeListener('declineUser');
        $scope.socket.removeListener('insertRequest');
      });
    }
  ]);

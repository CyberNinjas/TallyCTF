'use strict'
/**
 * @ngdoc controller
 * @name BaseTeamsController
 * @description
 * Adds socket functionality that is injected into the scope
 * of each of the team controllers
 */
angular.module('teams')
  .controller('BaseTeamsController', ['$scope', 'Teams', 'Authentication', 'Users', 'Socket',
    function ($scope, Teams, Authentication, Users, Socket) {

      $scope.authentication = Authentication.user;
      $scope.users = Users;
      $scope.teams = Teams.query();
      $scope.socket = Socket
      $scope.socket.connect()

      $scope.socket.on('newTeam', function (message) {
        message.newTeam.requestToJoin = []
        message.newTeam.askToJoin = []
        $scope.teams.push(message.newTeam)
      });

      $scope.socket.on('deleteTeam', function (message) {
        var newTeams = []
        angular.forEach($scope.teams, function (team) {
          if(team._id !== message.team._id) {
            newTeams.push(team)
          }
        })
        $scope.teams = newTeams
      });

      $scope.socket.on('insertRequest', function (message) {
        $scope.team.requestToJoin.push(message);
      });

      $scope.socket.on('acceptUser', function (message) {
        angular.forEach($scope.teams, function (team) {
          if(team._id === message.data) {
            team.members.push($scope.authentication._id)
            console.log(team);
          }
        })
      });

      $scope.socket.on('declineUser', function (message) {
        angular.forEach($scope.teams, function (team) {
          if(team._id === message.data) {
            team.requestToJoin.splice(team.requestToJoin.indexOf($scope.authentication._id))
          }
        })
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

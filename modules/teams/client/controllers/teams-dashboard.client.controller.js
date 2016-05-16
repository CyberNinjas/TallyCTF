'use strict'
/**
 * @ngdoc controller
 * @name TeamsListController
 * @description
 * This controller handles listing existing teams and giving
 * users the ability to join a listed team or choose to create a new one
 */
angular.module('teams')
  .controller('TeamsDashboardController', ['$scope', 'Teams', 'TeamsCtl', '$controller',
    function ($scope, Teams, TeamsCtl, $controller) {
      $controller('BaseTeamsController', {
        $scope: $scope
      });

      $scope.findTeam = function () {
        $scope.requestTeams = Teams.findRequests();
        $scope.askTeams = Teams.findAsks();
        $scope.teams = []
        angular.forEach($scope.authentication.team, function (team) {
          $scope.teams.push(Teams.get({
            teamId: team
          }))
        })
      };
      /** Allows a user to accept a team or vice-versa
       *
       * @param usr
       * @param cond
       */
      $scope.accept = function (usr, cond) {
        var user = (usr ? usr : $scope.authentication);
        var team = (typeof cond === 'number' ? $scope.team : cond);
        if($scope.authentication.team) {
          var add = team.requestToJoin.splice(cond, 1);
          team.members.push(add[0]);
          $scope.socket.emit('userUpdate', {
            recipients: [user._id],
            op: 'insertTeam',
            scopeField: 'team.askToJoin',
            data: team._id
          });
        }
        team.temp = user._id;
        TeamsCtl.accept(team);
      };
      /** Allows a user to decline a team or vice-versa
       *
       * @param usr
       * @param index
       * @param tm
       */
      $scope.decline = function (usr, index, tm) {
        var user = (usr ? usr : $scope.authentication);
        var team = (tm ? tm : $scope.team);
        if($scope.authentication.team) {
          $scope.socket.emit('userUpdate', {
            recipients: [user._id],
            op: 'remove',
            field: 'requestToJoin',
            scopeField: 'requestTeams',
            data: team._id
          });
          team.requestToJoin.splice(index, 1);
        } else {
          $scope.askTeams.splice(index, 1);
        }
        team.temp = user._id;
        TeamsCtl.decline(team);
      };
    }
  ]);

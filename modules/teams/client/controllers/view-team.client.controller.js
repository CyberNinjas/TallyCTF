'use strict'
/**
 * @ngdoc controller
 * @name TeamsViewController
 * @description
 * This controller handles displaying info about any given team.
 * For captains this includes outstanding requests and asks.
 */
angular.module('teams').controller('TeamsViewController', ['$scope', '$stateParams', '$location', 'Teams', 'TeamsCtl', '$controller', 'SweetAlert',
  function ($scope, $stateParams, $location, Teams, TeamsCtl, $controller, SweetAlert) {
    $controller('BaseTeamsController', {
      $scope: $scope
    });
    $scope.findCurrentTeam = function () {
      $scope.team = Teams.get({
        teamId: $stateParams.teamId
      });
      console.log($scope.team);
    };
    $scope.shouldRender = function (rle, usr) {
      var role = (typeof rle === 'string' ? [rle] : rle);
      var user = (usr ? usr : $scope.authentication);
      if(role.indexOf('user') !== -1) {
        return(user)
      }
      for(var i = 0; i < role.length; ++i) {
        if(user && user.roles.indexOf(role[i]) !== -1) {
          return true;
        }
      }
    };
    /** Checks if the current user is the captain of the team
     *
     * @param hideFromAdmin
     * @returns {boolean}
     */
    $scope.isCaptain = function (hideFromAdmin) {
      var team = $scope.team;
      hideFromAdmin = (hideFromAdmin ? hideFromAdmin : false);
      if($scope.authentication && team && team.$resolved) {
        if($scope.authentication.roles.indexOf('admin') === -1) {
          return(team.teamCaptain._id.toString() === $scope.authentication._id.toString());
        } else {
          return(!hideFromAdmin || (team.teamCaptain._id.toString() === $scope.authentication._id.toString()));
        }
      } else {
        return false;
      }
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
        $scope.socket.emit('acceptUser', {
          recipients: [user._id],
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
        $scope.socket.emit('declineUser', {
          recipients: [user._id],
          data: team._id
        });
        team.requestToJoin.splice(index, 1);
      } else {
        $scope.askTeams.splice(index, 1);
      }
      team.temp = user._id;
      TeamsCtl.decline(team);
    };
    $scope.confirmDelete = function () {
      SweetAlert.swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this team!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: false
      }, function (isConfirm) {
        if(isConfirm) {
          $scope.remove();
          SweetAlert.swal('Removed!');
        }
      });
    };
    /** Remove existing Team
     *
     * @param team
     */
    $scope.remove = function (team) {
      if(team) {
        team.$remove();
        for(var i in $scope.teams) {
          if($scope.teams[i] === team) {
            $scope.teams.splice(i, 1);
          }
        }
      } else {
        $scope.team.$remove(function (response) {
          $scope.socket.emit('deleteTeam', {
            team: $scope.team
          });
          $location.path('teams');
        });
      }
    };
  }
]);

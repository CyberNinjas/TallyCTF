'use strict'
angular.module('teams')
  .controller('TeamsViewController', ['$scope', '$stateParams', '$location',
    'Teams', '$controller', '$filter', 'SweetAlert', 'Users',
    function ($scope, $stateParams, $location, Teams, $controller, $filter,
      SweetAlert, Users) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      $scope.teams.$promise.then(function(){
        $scope.team = $filter('filter')($scope.teams, { _id: $stateParams.teamId })[0];
      });

      $scope.isCaptain = function () {
        if ($scope.authentication && $scope.team) {
          if ($scope.authentication.roles.indexOf('admin') === -1) {
            return ($scope.team.teamCaptain === $scope.authentication
              ._id);
            return false;
          }
        }
      };

      $scope.accept = function (user, index) {
        $scope.team.members.push(user);
        var userId = $scope.team.joinRequestsFromUsers.indexOf(user._id)

        $scope.team.joinRequestsFromUsers.splice(userId, 1);
        Teams.update($scope.team, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        user.requestToJoin.splice(user.requestToJoin.indexOf($scope.team._id))
        Users.update(user, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        $scope.socket.emit('acceptUser', {
          user: user,
          data: $scope.team._id
        });
      };

      $scope.decline = function (user, index) {
        var userId = $scope.team.joinRequestsFromUsers.indexOf(user._id)
        $scope.team.joinRequestsFromUsers.splice(userId, 1);

        Teams.update($scope.team, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        user.requestToJoin.splice(user.requestToJoin.indexOf($scope.team._id))
        Users.update(user, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        $scope.socket.emit('declineUser', {
          user: user,
          data: $scope.team._id
        });
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
          if (isConfirm) {
            $scope.remove();
            SweetAlert.swal('Removed!');
          }
        });
      };

      $scope.remove = function () {
        Teams.remove({ teamId: $scope.team._id }, function (response) {
          $scope.socket.emit('deleteTeam', {
            team: $scope.team
          });
          $location.path('teams');
        });
      }
    }
]);

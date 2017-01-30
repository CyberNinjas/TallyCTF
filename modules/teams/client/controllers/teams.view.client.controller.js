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

      /**
       * Determines whether or not the current user is the captain of the team that they're
       * currently viewing.
       *
       * @returns {boolean} - Whether or not the user is the captain.
       */
      $scope.isCaptain = function () {
        if ($scope.authentication && $scope.team) {
          if ($scope.authentication.roles.indexOf('admin') === -1) {
            return ($scope.team.teamCaptain === $scope.authentication
              ._id);
          }
          return false;
        }
      };

      /**
       * Gathers the User object of the current user. Removes the team that they've requested
       * to leave from their teams object. Then removes their id from the team's member array.
       */
      $scope.leaveTeam = function () {
        var currentUser = $filter('filter')($scope.users, { _id: $scope.authentication._id })[0];
        currentUser.team.splice(currentUser.team.indexOf($scope.team._id))
        Users.update(currentUser, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        var userId = $scope.team.members.indexOf(currentUser._id)
        $scope.team.members.splice(userId, 1);
        Teams.update($scope.team, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }

      /**
       * When a user is accepted to a team their id is first added to the team's member array.
       * then they're removed from the team's request object because that request is no longer
       * valid.
       *
       * Then the team is added to the user's team object and removed from their outstanding requests
       * as well.
       *
       * A socket emit is called to notify all users of the change.
       *
       * @param user - the user being accepted
       */
      $scope.accept = function (user) {
        $scope.team.members.push(user);
        var userId = $scope.team.joinRequestsFromUsers.indexOf(user._id)
        $scope.team.joinRequestsFromUsers.splice(userId, 1);
        Teams.update($scope.team, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        var currentUser = $filter('filter')($scope.users, { _id: user._id })[0];
        currentUser.requestedToJoin.splice(currentUser.requestedToJoin.indexOf($scope.team._id))
        currentUser.teams.push($scope.team._id)
        Users.update(currentUser, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        $scope.socket.emit('acceptUser', {
          user: user,
          data: $scope.team._id
        });
      };

      /**
       * When a user's request is declined their id is removed from the team's requests
       * from users and the teams id is removed from the user's requests.
       *
       * A socket emit is called to notify all users of the change.
       *
       * @param user - the user being declined
       */
      $scope.decline = function (user) {
        var userId = $scope.team.joinRequestsFromUsers.indexOf(user._id)
        $scope.team.joinRequestsFromUsers.splice(userId, 1);

        Teams.update($scope.team, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        user.requestedToJoin.splice(user.requestedToJoin.indexOf($scope.team._id))
        Users.update(user, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        $scope.socket.emit('declineUser', {
          user: user,
          data: $scope.team._id
        });
      };

      /**
       * Triggers a modal used to confirm the team's deletion.
       */
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

      /**
       * Deletes the current team from the database.
       */
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

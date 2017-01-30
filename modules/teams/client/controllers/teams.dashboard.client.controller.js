'use strict'

angular.module('teams')
  .controller('TeamsDashboardController', ['$scope', 'Teams',
    '$controller', '$filter', 'Users',
    function ($scope, Teams, $controller, $filter, Users) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      /**
       * If a user accepts a team's request their id is removed from the list of
       * requests made by the team. Then the team is removed from the users list
       * of outstanding requests and added to their teams.
       *
       * A socket message is emitted to notify other users of the new membership
       *
       * @param team - the team being added
       */
      $scope.accept = function (team) {
        var userId = team.joinRequestsToUsers.indexOf($scope.authentication._id)
        team.joinRequestsToUsers.splice(userId, 1);
        team.members.push($scope.authentication);

        Teams.update(team, function () {}, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        $scope.authentication.wasAskedToJoin.splice($scope.authentication.wasAskedToJoin.indexOf(team._id))
        $scope.authentication.team.push(team._id)
        Users.update($scope.authentication, function () {}, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        $scope.socket.emit('acceptUser', {
          user: user,
          data: $scope.team._id
        });
      };

      /**
       * When a user declines a team's request the id of the team being declined
       * is removed from both the list of reqests made by the team and the outstanding
       * requests of the user
       *
       * A socket message is emitted to notify other users of the new membership
       *
       * @param team - the team being declined
       */
      $scope.decline = function (index, team) {
        var userId = team.joinRequestsToUsers.indexOf($scope.authentication._id)
        team.joinRequestsToUsers.splice(userId, 1);
        Teams.update($scope.team, function () {}, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        user.requestedToJoin.splice(user.requestedToJoin.indexOf(team._id))
        Users.update(user, function () {}, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        $scope.socket.emit('declineUser', {
          user: user,
          data: $scope.team._id
        });
      };
    }
  ]);

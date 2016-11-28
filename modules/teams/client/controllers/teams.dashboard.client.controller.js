'use strict'

angular.module('teams')
  .controller('TeamsDashboardController', ['$scope', 'Teams',
    '$controller', '$filter', 'Users',
    function ($scope, Teams, $controller, $filter, Users) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

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

        $scope.socket.emit('userUpdate', {
          recipients: [user._id],
          op: 'insertTeam',
          scopeField: 'team.askToJoin',
          data: team._id
        });
      };

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

        $scope.socket.emit('userUpdate', {
          recipients: [user._id],
          op: 'remove',
          field: 'wasAskedToJoin',
          scopeField: 'requestTeams',
          data: team._id
        });
      };
    }
  ]);

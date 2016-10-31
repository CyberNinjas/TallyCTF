'use strict'

angular.module('teams')
  .controller('AddUsersTeamsController', ['$scope', '$stateParams',
    '$controller', 'Teams', 'Users', '$filter',
    function ($scope, $stateParams, $controller, Teams, Users, $filter) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      $scope.teams.$promise.then(function(){
        $scope.team = $filter('filter')($scope.teams, { _id: $stateParams.teamId })[0];
      })
      $scope.addUserToTeam = function (user) {
        $scope.team.joinRequestsToUsers.push(user)
        Teams.update($scope.team, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        user.askToJoin.push($scope.team._id)
        Users.update(user, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };
    }
  ])

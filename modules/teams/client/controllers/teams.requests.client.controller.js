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

      /**
       * When a captain selects a user that they'd like to request to join their
       * team the user's id is added to the team's sent requests and the team is
       * added to the list of teams that have requested the user.
       *
       * @param user - the user being requested
       */
      $scope.addUserToTeam = function (user) {
        $scope.team.joinRequestsToUsers.push(user)
        Teams.update($scope.team, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        user.wasAskedToJoin.push($scope.team._id)
        Users.update(user, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };
    }
  ])

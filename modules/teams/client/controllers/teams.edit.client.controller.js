'use strict'
angular.module('teams')
  .controller('EditTeamsController', ['$scope', '$stateParams', '$controller',
    '$location', 'Teams', 'Users', '$filter', '$state',
    function ($scope, $stateParams, $controller, $location, Teams, Users, $filter, $state) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      $scope.teams.$promise.then(function () {
        $scope.team = $filter('filter')($scope.teams, { _id: $stateParams.teamId })[0];
      });

      /**
       * Determines whether or not the current user is the captain of the current team
       * @returns {boolean} - The user is the captain or false if they aren't
       */
      $scope.isCaptain = function () {
        if ($scope.authentication) {
          if ($scope.authentication.roles.indexOf('admin') === 0) {
            return ($scope.team.teamCaptain === $scope.authentication._id);
          }
          return false;
        }
      };

      /**
       * Updates the team if the form's changes are valid
       * @param isValid - Whether or not the changes are valid
       */
      $scope.update = function (isValid) {
        $scope.error = null;
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'teamForm');
          return false;
        }
        var team = $scope.team;
        Teams.update(team, function () {
          $state.go('teams.view', { teamId: team._id });
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      /**
       * Removes the user in contention from the current team
       * @param user - the user being removed
       * @param index - the user's index in the team's user array
       */
      $scope.removeMember = function (user, index) {
        user.teams.splice(user.teams.indexOf($scope.team._id), 1)
        Users.update(user, function () {},
          function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        $scope.team.members.splice(index, 1);
        $scope.update(true)
      };
    }
  ]);

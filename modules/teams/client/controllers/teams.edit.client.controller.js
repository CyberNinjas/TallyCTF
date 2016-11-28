'use strict'
angular.module('teams')
  .controller('EditTeamsController', ['$scope', '$stateParams', '$controller',
    '$location', 'Teams', 'Users', '$filter', '$state',
    function ($scope, $stateParams, $controller, $location, Teams, Users, $filter, $state) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      $scope.teams.$promise.then(function() {
        $scope.team = $filter('filter')($scope.teams, { _id: $stateParams.teamId
         })[0];
      });

      $scope.isCaptain = function () {
        if ($scope.authentication) {
          if ($scope.authentication.roles.indexOf('admin') === 0) {
            return ($scope.team.teamCaptain === $scope.authentication
              ._id);
          }
          return false;
        }
      };

      $scope.update = function (isValid) {
        $scope.error = null;
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'teamForm');
          return false;
        }
        var team = $scope.team;
        Teams.update(team, function () {
          $state.go('teams.view', {
            teamId: team._id
          });
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.removeMember = function (user, index) {
        user.teams.splice(user.team.indexOf($scope.team._id), 1)
        Users.update(user, function () {},
        function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
        $scope.team.members.splice(index, 1);
        $scope.update(true)
      };
    }
  ]);

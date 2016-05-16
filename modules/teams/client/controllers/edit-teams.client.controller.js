'use strict'
/**
 * @ngdoc controller
 * @name TeamsListController
 * @description
 * This controller handles listing existing teams and giving
 * users the ability to join a listed team or choose to create a new one
 */
angular.module('teams')
  .controller('EditTeamsController', ['$scope', '$stateParams', '$controller', '$location', 'Teams', 'TeamsCtl',
    function($scope, $stateParams, $controller, $location, Teams, TeamsCtl) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      $scope.findOne = function() {
        $scope.team = Teams.get({
          teamId: $stateParams.teamId
        });
      };

      /** Remove a user from the team when editing the team
       *
       * @param user
       * @param index
       */
      $scope.removeMember = function(user, index) {
        $scope.team.members.splice(index, 1);
        $scope.team.temp = user._id;
        TeamsCtl.remove($scope.team);
      };

      $scope.isCaptain = function() {
        var team = $scope.team;
        if($scope.authentication && team && team.$resolved) {
          if((team.teamCaptain._id.toString() === $scope.authentication._id.toString())) {
            return false
          }
        } else {
          return true;
        }
      };
      /** Update existing Team
       *
       * @param isValid
       * @returns {boolean}
       */
      $scope.update = function(isValid) {
        $scope.error = null;
        if(!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'teamForm');
          return false;
        }
        var team = $scope.team;
        team.$update(function() {
          $location.path('teams/' + team._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

    }
  ]);

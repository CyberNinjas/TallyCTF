'use strict'
/**
 * @ngdoc controller
 * @name CreateTeamsController
 * @description
 * Creates a new team and saves it to the database
 * On success it redirects to the add users page
 */
angular.module('teams')
  .controller('CreateTeamsController', ['$scope', '$state', '$controller', 'Teams',
    function ($scope, $state, $controller, Teams) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      /** Create new Team
       *
       * @param isValid
       * @returns {boolean}
       */
      $scope.create = function (isValid) {
        $scope.error = null;
        if(!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'teamForm');
          return false;
        }
        var team = new Teams({
          teamName: this.teamName,
          members: $scope.authentication._id,
          teamCaptain: $scope.authentication._id
        });
        var msg = {}
        msg['newTeam'] = team;
        $scope.socket.emit('newTeam', msg)
        team.$save(function (response) {
          $scope.authentication = response;
          $scope.teamName = '';
          $state.go('teams.add', { teamId: team._id });
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };
    }
  ]);

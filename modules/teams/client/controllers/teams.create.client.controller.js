'use strict'
angular.module('teams')
  .controller('CreateTeamsController', ['$scope', '$state','$filter', '$controller', 'Teams',
    function ($scope, $state, $filter, $controller, Teams) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      /**
       * Creates a new team object and sends a socket message to the other users
       * so that they're aware of and are able to join the team.
       *
       * @param isValid - Whether or not the team form is valid
       */
      $scope.create = function (isValid) {
        $scope.error = null;
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'teamForm');
          return false;
        }
        var team = {
          teamName: this.teamName,
          members: $scope.authentication._id,
          teamCaptain: $scope.authentication._id
        };
        $scope.socket.emit('newTeam', { 'newTeam': team })
        Teams.save(team, function (response) {
          $scope.teamName = '';
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        }).$promise.then(function(){
          if(!$scope.error){
            $state.go('teams.add', {
              teamId: team._id
            });
          }
        })
      }
    }
]);

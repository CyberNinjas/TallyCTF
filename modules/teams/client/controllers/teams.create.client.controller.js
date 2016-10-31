'use strict'
angular.module('teams')
  .controller('CreateTeamsController', ['$scope', '$state', '$controller',
    'Teams',
    function ($scope, $state, $controller, Teams) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

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

        var msg = {
          'newTeam': team,
        }

        $scope.socket.emit('newTeam', msg)

        Teams.save(team, function (response) {
          $scope.teamName = '';
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        }).$promise.then(function(){
          if(!$scope.error){
            $scope.authentication.roles.push('teamCaptain');
            $state.go('teams.add', {
              teamId: team._id
            });
          }
        })
      }
    }
]);

'use strict'
angular.module('teams')
  .controller('CreateTeamsController', ['$scope', '$state','$filter', '$controller',
    'Teams', 'Users', 'Authentication',
    function ($scope, $state, $filter, $controller, Teams, Users, Authentication) {

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
            $state.go('teams.add', {
              teamId: team._id
            });
          }
        })
      }
    }
]);

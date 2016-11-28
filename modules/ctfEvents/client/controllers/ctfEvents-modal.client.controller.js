angular.module('ctfEvents').controller('ModalController', ['$scope', 'usersTeamsService', 'close',
  function($scope, usersTeamsService, close) {
    $scope.usersTeams = usersTeamsService.getTeams()
    $scope.selectedTeam = $scope.usersTeams[0]
    $scope.close = function() {
      close($scope.selectedTeam, 500);
    };
  }
]);

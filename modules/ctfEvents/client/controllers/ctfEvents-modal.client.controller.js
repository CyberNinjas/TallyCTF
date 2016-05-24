angular.module('ctfEvents').controller('ModalController', ['$scope', 'captainsTeamsService', 'close',
  function($scope, captainsTeamsService, close) {
    $scope.captainsTeams = captainsTeamsService.getTeams()
    $scope.selectedTeam = $scope.captainsTeams[0]
    $scope.close = function() {
      close($scope.selectedTeam, 500); // close, but give 500ms for bootstrap to animate
    };
  }
]);

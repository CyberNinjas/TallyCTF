'use strict'
angular.module('ctfEvents').controller('BaseEventsController', ['$scope', '$q', 'Teams',
  'Authentication', 'Users', 'Socket', 'Challenges', 'CtfEvents', 'Cache',
  function ($scope, $q, Teams, Authentication, Users, Socket, Challenges, CtfEvents, Cache) {
    $scope.authentication = Authentication.user;
    $scope.userId = Authentication.user._id

    $scope.socket = Socket;
    $scope.socket.connect();

    $scope.all = $q.all([
      Users.query().$promise,
      Challenges.query().$promise,
      Teams.query().$promise,
      CtfEvents.query().$promise,
    ]).then(function (data) {
      $scope.users = data[0];
      $scope.challenges = data[1];
      $scope.teams = data[2];
      $scope.ctfEvents = data[3];
    })

    $scope.socket.on('invalidate', function (id) {
      Cache.invalidate('api/ctfEvents/' + id);
    });

    $scope.socket.on('invalidateAll', function () {
      Cache.invalidateAll();
    });

    $scope.$on('$destroy', function () {
      $scope.socket.removeListener('invalidate');
      $scope.socket.removeListener('invalidateAll');
    })
  }
]);

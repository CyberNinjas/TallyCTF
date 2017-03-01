'use strict'
angular.module('ctfEvents').controller('BaseEventsController', ['$scope', '$q', 'Teams',
  'Authentication', 'Users', 'Socket', 'Challenges', 'CtfEvents', 'Cache', '$stateParams', 'CacheFactory',
  function ($scope, $q, Teams, Authentication, Users, Socket, Challenges, CtfEvents, Cache, $stateParams, CacheFactory) {
    $scope.authentication = Authentication.user;
    $scope.userId = Authentication.user._id

    var resources = [
      Users.query().$promise,
      Challenges.query().$promise,
      Teams.query().$promise,
      CtfEvents.query().$promise,
    ]

    var eventCache = CacheFactory.get('eventCache');
    $scope.ctfEvent = eventCache.get('api/ctfEvents/' + $stateParams.ctfEventId)
    if ($stateParams.ctfEventId && !$scope.ctfEvent) {
      resources.push(CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise)
    } else if ($stateParams.ctfEventId && $scope.ctfEvent.hasOwnProperty('$$state') > 0) {
      resources.push(CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise)
    } else if ($stateParams.ctfEventId) {
      $scope.ctfEvent = JSON.parse($scope.ctfEvent[1])
    }

    $scope.all = $q.all(resources).then(function (data) {
      $scope.users = data[0];
      $scope.challenges = data[1];
      $scope.teams = data[2];
      $scope.ctfEvents = data[3];
      if (data.length == 5) {
        $scope.ctfEvent = data[4]
      }
    })

    $scope.socket = Socket;
    $scope.socket.connect();

    $scope.socket.on('invalidate', function (id) {
      Cache.invalidate('api/ctfEvents/' + id)
      CtfEvents.query().$promise.then(function (data) {
        $scope.ctfEvents = data;
      })
    });

    $scope.socket.on('invalidateAll', function () {
      Cache.invalidateAll()
      CtfEvents.query().$promise.then(function (data) {
        $scope.ctfEvents = data;
      })
    });

    $scope.socket.on('invalidateList', function () {
      Cache.invalidate('api/ctfEvents');
    });

    $scope.socket.on('deleteEvent', function (message) {
      $scope.ctfEvents = $scope.ctfEvents.filter(function (event) {
        if (event._id !== message.id) {
          return event
        }
      })
    });

    $scope.$on('$destroy', function () {
      $scope.socket.removeListener('invalidate');
      $scope.socket.removeListener('invalidateAll');
      $scope.socket.removeListener('invalidateList');
      $scope.socket.removeListener('invalidateList');
      $scope.socket.removeListener('deleteEvent');
    })
  }
]);

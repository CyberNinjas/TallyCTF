'use strict';
angular.module('ctfEvents').controller('UpdateEventsController', ['$scope', '$filter', '$state', '$stateParams', '$location', '$q', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', function ($scope, $filter, $state, $stateParams, $location, $q, Authentication, CtfEvents, Challenges, Teams, Users) {
  $q.all([
    Users.query().$promise,
    Challenges.query().$promise,
    CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise,
  ]).then(function (data) {
    $scope.users = data[0];
    $scope.challenges = data[1];
    $scope.ctfEvent = data[2];
    return
  }).then(function () {
    $scope.challengeOptions = {
      title: 'Challenges',
      display: 'name',
      items: $filter('unselectedObject')($scope.challenges, $scope.ctfEvent.challenges),
      selectedItems: $filter('selectedObject')($scope.challenges, $scope.ctfEvent.challenges)
    };
    $scope.userOptions = {
      title: 'Users',
      display: 'firstName',
      items: $filter('unselected')($scope.users, $scope.ctfEvent.users),
      selectedItems: $filter('selected')($scope.users, $scope.ctfEvent.users)
    };
  });

  $scope.remove = function (ctfEvent) {
    if (!confirm('Are you sure that you want to delete this event?')) return;
    CtfEvents.remove({ ctfEventId: $scope.ctfEvent._id }, function (response) {
      $location.path('ctfEvents');
    });
  };

  $scope.update = function (isValid) {
    $scope.error = null;
    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'ctfEventForm');
      return false;
    }
    $scope.ctfEvent.challenges = []
    $scope.challengeOptions.selectedItems.forEach(function (obj) {
      $scope.ctfEvent.challenges.push(obj);
    })
    $scope.ctfEvent.users = []
    $scope.userOptions.selectedItems.forEach(function (obj) {
      $scope.ctfEvent.users.push(obj._id);
    })
    CtfEvents.update($scope.ctfEvent, function (res) {
      $location.path('ctfEvents');
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  }
}])

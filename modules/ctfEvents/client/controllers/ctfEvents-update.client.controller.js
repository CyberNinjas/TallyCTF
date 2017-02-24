'use strict';
angular.module('ctfEvents').controller('UpdateEventsController', ['$scope', '$controller', '$filter', '$state', '$stateParams', '$location', '$q', 'SweetAlert', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', 'Cache', function ($scope, $controller, $filter, $state, $stateParams, $location, $q, SweetAlert, Authentication, CtfEvents, Challenges, Teams, Users, Cache) {

  $controller('BaseEventsController', {
    $scope: $scope
  });

  $scope.all.then(function () {
    CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise.then(function (data) {
      $scope.ctfEvent = data
      $scope.challengeOptions = {
        title: 'Challenges',
        display: 'name',
        items: $filter('unselectedChallenge')($scope.challenges, $scope.ctfEvent.challenges),
        selectedItems: $filter('selectedChallenge')($scope.challenges, $scope.ctfEvent.challenges)
      };
      $scope.userOptions = {
        title: 'Users',
        display: 'firstName',
        items: $filter('unselected')($scope.users, $scope.ctfEvent.users),
        selectedItems: $filter('selected')($scope.users, $scope.ctfEvent.users)
      };
    })
  })

  /**
   * Triggers a modal used to confirm the event's deletion.
   */
  $scope.confirmDelete = function () {
    SweetAlert.swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this event!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: true
    }, function (isConfirm) {
      if (isConfirm) {
        $scope.remove();
      }
    });
  };

  /**
   * Removes the Event object once the user confirms the action
   */
  $scope.remove = function () {
    CtfEvents.remove({ ctfEventId: $scope.ctfEvent._id }, function () {
      $scope.socket.emit('invalidateAll')
      $location.path('ctfEvents');
    });
  };

  /**
   * Updates an event with the newly selected options including the challenges
   * and users in the dual multi-selects
   *
   * @param isValid - whether or not the form is valid
   */
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
      $scope.socket.emit('invalidateAll')
      $location.path('ctfEvents');
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  }
}])

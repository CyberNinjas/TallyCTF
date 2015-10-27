'use strict';

// CtfEvents controller
angular.module('ctfEvents').controller('CtfEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'CtfEvents',
  function ($scope, $stateParams, $location, Authentication, CtfEvents) {
    $scope.authentication = Authentication;

    // Create new CtfEvent
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ctfEventForm');

        return false;
      }

      // Create new CtfEvent object
      var ctfEvent = new CtfEvents({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      ctfEvent.$save(function (response) {
        $location.path('ctfEvents/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing CtfEvent
    $scope.remove = function (ctfEvent) {
      if (ctfEvent) {
        ctfEvent.$remove();

        for (var i in $scope.ctfEvents) {
          if ($scope.ctfEvents[i] === ctfEvent) {
            $scope.ctfEvents.splice(i, 1);
          }
        }
      } else {
        $scope.ctfEvent.$remove(function () {
          $location.path('ctfEvents');
        });
      }
    };

    // Update existing CtfEvent
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ctfEventForm');

        return false;
      }

      var ctfEvent = $scope.ctfEvent;

      ctfEvent.$update(function () {
        $location.path('ctfEvents/' + ctfEvent._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of CtfEvents
    $scope.find = function () {
      $scope.ctfEvents = CtfEvents.query();
    };

    // Find existing CtfEvent
    $scope.findOne = function () {
      $scope.ctfEvent = CtfEvents.get({
        ctfEventId: $stateParams.ctfEventId
      });
    };
  }
]);

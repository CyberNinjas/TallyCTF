'use strict';

// CtfEvents controller
angular.module('ctfEvents').controller('CtfEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'UserAuths',
  function ($scope, $stateParams, $location, Authentication, CtfEvents, Challenges, Teams, UserAuths) {
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
        created: this.created,
        title: this.title,
        start: this.start,
        end: this.end
        // Eventually add ability to import
        //challenges: this.import.challenges,
        //teams: this.import.teams,
        //users: this.import.users,
        //userAuths: this.import.userAuths
      });

      // Redirect after save
      ctfEvent.$save(function (response) {
        $location.path('ctfEvents/' + response._id);

        // Clear form fields
        $scope.created = '';
        $scope.title = '';
        $scope.start = '';
        $scope.end = '';
        //$scope.import = '';
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
        $location.path('ctfEvents');
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

      // Load the extra data
      $scope.challenges = Challenges.query();
      $scope.teams = Teams.query();
      $scope.userAuths = UserAuths.query();
    };
  }
]).directive('datetime', function () {
  // Needed to tell JSHint about the external $ (jquery)
  /* globals $ */
  return {
    link: function (scope, elem, attrs) {
      $(function () {
        $(elem).datetimepicker({
          format: "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
        });
      });
    }
  };
}).directive('collapse', function () {
  return {
    link: function (scope, elem, attrs) {
      $(elem).on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.collapse-group').find('.collapse');
        $collapse.collapse('toggle');
      });
    }
  };
});

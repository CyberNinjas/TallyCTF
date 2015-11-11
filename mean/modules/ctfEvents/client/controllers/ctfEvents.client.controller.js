'use strict';

// CtfEvents controller
angular.module('ctfEvents').controller('CtfEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'CtfEvents', 'CurrentCtfEvents', 'Challenges', 'Teams', 'Users', 'EventLoad',
  function ($scope, $stateParams, $location, Authentication, CtfEvents, CurrentCtfEvents, Challenges, Teams, Users, EventLoad) {
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
        //users: this.import.users
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

    // Load an event's data into the current working set
    $scope.loadIntoCurrent = function (ctfEvent) {
      var _ctfEvent = (ctfEvent ? ctfEvent : $scope.ctfEvent);
      var data = {
        'Challenges': _ctfEvent.challenges,
        'Teams': _ctfEvent.teams,
        'Users': _ctfEvent.users
      };

      EventLoad.update(data);
    };

    // Set Current CTFEvent
    $scope.setCurrent = function (ctfEvent) {
      // Save basic info to the current event
      var _ctfEvent = (ctfEvent ? ctfEvent : $scope.ctfEvent);

      var currentCtfEvent = new CurrentCtfEvents({
        title: _ctfEvent.title,
        start: _ctfEvent.start,
        end  : _ctfEvent.end
      });

      currentCtfEvent.$save(function (response) {}, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      // FIXME: Add a way to prompt the user to save the current working set if
      // FIXME: there are things in it (challenges, users, etc.)
      // Clear the working set
      CurrentCtfEvents.clear();

      // Load the event's data into the working set
      $scope.loadIntoCurrent();

      // Redirect back to the ctfEvents page
      $location.path('/ctfEvents/current');
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
    };

    // Find existing current CtfEvent
    $scope.findCurrent = function () {
      $scope.ctfEvent = CurrentCtfEvents.get();

      // Load the extra data
      $scope.challenges = Challenges.query();
      $scope.teams = Teams.query();
      $scope.users = Users.query();
    };
  }
]);

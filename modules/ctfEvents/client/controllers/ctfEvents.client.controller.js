'use strict';

// CtfEvents controller
angular.module('ctfEvents').controller('CtfEventsController', ['$scope','$stateParams', '$location', 'Authentication', 'CtfEvents', 'CurrentCtfEvents', 'Challenges', 'Teams', 'Users',
  function ($scope, $stateParams, $location, Authentication, CtfEvents, CurrentCtfEvents, Challenges, Teams, Users) {
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
        //set value of new object to field's values
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
      // Confirm deletion
      if (!confirm('Are you sure that you want to delete this event?'))
        return;

      if (ctfEvent) {
        // from backend:
        ctfEvent.$remove();

        // from display:
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

    // Save the Current Event to the db
    $scope.saveCurrent = function () {

      // Create new CtfEvent object
      var ctfEvent = new CtfEvents({
        created: Date.now(),
        title: $scope.ctfEvent.title,
        start: $scope.ctfEvent.start,
        end: $scope.ctfEvent.end,
        challenges: $scope.challenges,
        teams: $scope.teams,
        users: $scope.users
      });

      // Redirect after save
      ctfEvent.$save(function (response) {
        $location.path('ctfEvents/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Clear the current event
    $scope.removeCurrent = function () {
      CurrentCtfEvents.clear();
    };

    // Load an event's data into the current working set
    $scope.loadIntoCurrent = function (ctfEvent) {
      var _ctfEvent = (ctfEvent ? ctfEvent : $scope.ctfEvent);
      var data = {
        'Challenges': _ctfEvent.challenges,
        'Teams': _ctfEvent.teams,
        'Users': _ctfEvent.users
      };

      CurrentCtfEvents.load(data);
    };

    // Set Current CTFEvent
    $scope.setCurrent = function (ctfEvent) {
      // Save basic info to the current event
      var _ctfEvent = (ctfEvent ? ctfEvent : $scope.ctfEvent);

      // create new ctfEvent object and assign to it the following fields
      var currentCtfEvent = new CurrentCtfEvents({
        title: _ctfEvent.title,
        start: _ctfEvent.start,
        end  : _ctfEvent.end
      });

      // save new ctfEvent to db
      currentCtfEvent.$save(function (response) {}, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      // FIXME: Add a way to prompt the user to save the current working set if
      // FIXME: there are things in it (challenges, users, etc.)
      // Clear the working set
      $scope.removeCurrent();

      // Load the event's data into the working set
      $scope.loadIntoCurrent();

      // Redirect back to the ctfEvents page
      $location.path('/ctfEvents');
    };

    // Update existing CtfEvent
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ctfEventForm');

        return false;
      }
      //get reference to in-browser ctfEvent
      var ctfEvent = $scope.ctfEvent;
      //commit ctfEvent to db
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

    // Find selected CtfEvent
    $scope.findOne = function () {
      var final = $location.path().split('/').pop();
      console.log(final);
      if(final === 'current'){
        $scope.ctfEvent = CurrentCtfEvents.get();
        $scope.challenges = Challenges.query();
        $scope.teams = Teams.query();
        $scope.users = Users.query();
      }
      else {
        $scope.ctfEvent = CtfEvents.get({
          ctfEventId: $stateParams.ctfEventId
        });
        $scope.currentCtfEvent = CurrentCtfEvents.get();
      }
    };
  }
]);

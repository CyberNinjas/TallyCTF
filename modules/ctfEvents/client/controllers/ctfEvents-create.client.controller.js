angular.module('ctfEvents').controller('CreateEventsController', ['$scope', '$controller', '$stateParams', '$location', '$q', 'Authentication',
  'CtfEvents', 'Challenges', 'Teams', 'Users', 'Cache',
  function ($scope, $controller, $stateParams, $location, $q, Authentication, CtfEvents, Challenges, Teams, Users, Cache) {

    $controller('BaseEventsController', {
      $scope: $scope
    });

    /**
     * Collects all users and challenges asynchronously and passes them
     * into the group of objects that the event creator is allowed to choose from
     */

    $scope.all.then(function () {
      $scope.userOptions = {
        title: 'Users',
        items: $scope.users,
        selectedItems: [],
        display: 'firstName'
      };
      $scope.challengeOptions = {
        title: 'Challenges',
        items: $scope.challenges,
        selectedItems: [],
        display: 'name'
      };
    })

    /**
     * Gathers all of the selected options including only the users and challenges
     * selected in the dual multi-selects and creates a new event object.
     *
     * @param isValid - Whether or not the Event creation form is valid
     */
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ctfEventForm');
        return false;
      }

      var eventTeams = [];
      var eventUsers = [];
      var eventChallenges = [];

      angular.forEach($scope.challengeOptions.selectedItems, function (challenge) {
        var currentChallenge = challenge.toJSON()
        delete currentChallenge._id
        delete currentChallenge.__v
        this.push(currentChallenge)
      }, eventChallenges)

      angular.forEach($scope.userOptions.selectedItems, function (user) {
        this.push(user._id)
      }, eventUsers)

      var ctfEvent = new CtfEvents({
        created: this.created,
        title: this.title,
        description: this.description,
        start: this.start,
        end: this.end,
        registrationStart: this.registrationStart,
        registrationEnd: this.registrationEnd,
        challenges: eventChallenges,
        teams: eventTeams,
        users: eventUsers
      });

      CtfEvents.save(ctfEvent, function (response) {
        $scope.socket.emit('invalidate', { id: response._id })
        $scope.socket.emit('invalidateAll')
        CtfEvents.get({ ctfEventId: response._id }).$promise.then(function (data) {
          console.info('grabbed ' + data)
        })
        $location.path('ctfEvents/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

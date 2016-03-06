angular.module('ctfEvents').controller('CreateEventsController', ['$scope','$stateParams', '$location', 'Authentication',
  'CtfEvents', 'Challenges', 'Teams', 'Users', function ($scope, $stateParams, $location, Authentication,
                                                                             CtfEvents, Challenges, Teams, Users) {

    // Find selected CtfEvent
    // Each query is nested in the previous one's promise to make sure
    // everything resolves before we set each of the select's options
    $scope.users = Users.query();
    $scope.users.$promise.then(function(data) {
      $scope.challenges = Challenges.query();
      $scope.challenges.$promise.then(function(data) {
        $scope.teams = Teams.query();
        $scope.teams.$promise.then(function(data) {

          //dual select options
          $scope.userOptions = {
            title: 'Users',
            items: $scope.users,
            selectedItems: [],
            display: 'firstName'
          };
          $scope.teamOptions= {
            title: 'Teams',
            items: $scope.teams,
            selectedItems: [],
            display: 'teamName'
          };
          $scope.challengeOptions = {
            title: 'Challenges',
            items: $scope.challenges,
            selectedItems: [],
            display: 'name'
          };

        });
      });
    });

    // Create new CtfEvent
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid){
        $scope.$broadcast('show-errors-check-validity', 'ctfEventForm');
        return false;
      }

      var eventTeams = [];
      angular.forEach($scope.teamOptions.selectedItems, function(team) {
        var teamListing = {};
        teamListing[team._id] = [];
        eventTeams.push(teamListing);
      });

      // Create new CtfEvent object
      var ctfEvent = new CtfEvents({
        //set value of new object to field's values
        created: this.created,
        title: this.title,
        description: this.description,
        start: this.start,
        end: this.end,
        registraionStart: this.registraionStart,
        registraionEnd: this.registraionEnd,
        challenges: $scope.challengeOptions.selectedItems,
        teams: eventTeams,
        users: $scope.userOptions.selectedItems
      });

      // Redirect after save
      ctfEvent.$save(function (response) {
        $location.path('ctfEvents/' + response._id);
        // Clear form fields
        $scope.created = '';
        $scope.title = '';
        $scope.start = '';
        $scope.end = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

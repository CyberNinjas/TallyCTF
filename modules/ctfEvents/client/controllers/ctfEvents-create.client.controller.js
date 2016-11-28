angular.module('ctfEvents').controller('CreateEventsController', ['$scope','$stateParams', '$location', '$q', 'Authentication',
  'CtfEvents', 'Challenges', 'Teams', 'Users', function ($scope, $stateParams, $location, $q, Authentication, CtfEvents, Challenges, Teams, Users) {

    /*
      Collect all users, challenges, and teams asynchronously and pass them
      into the group of objects the event creator is allowed to choose from
    */

    $q.all([
      Users.query().$promise,
      Challenges.query().$promise,
      Teams.query().$promise,
    ]).then(function(data) {
      $scope.users = data[0];
      $scope.challenges = data[1];
      $scope.teams = data[2];
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

    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid){
        $scope.$broadcast('show-errors-check-validity', 'ctfEventForm');
        return false;
      }

      var eventTeams = [];
      var eventUsers = [];
      var eventChallenges = [];

      angular.forEach($scope.challengeOptions.selectedItems, function(challenge) {
        var currentChallenge = challenge.toJSON()
        delete currentChallenge._id
        delete currentChallenge.__v
        this.push(currentChallenge)
      }, eventChallenges)

      angular.forEach($scope.teamOptions.selectedItems, function(team) {
        this.push({ 'team': team._id, 'members': [] });
      }, eventTeams)

      angular.forEach($scope.userOptions.selectedItems, function(user) {
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
        $location.path('ctfEvents/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('ctfEvents').controller('ListEventsController', ['$state','$scope','$stateParams', '$location', 'Authentication',
  'CtfEvents', function ($state, $scope, $stateParams, $location, Authentication, CtfEvents) {
    $scope.authentication = Authentication;
    $scope.userId = $scope.authentication.user._id
    $scope.ctfEvents = CtfEvents.query();


    // This is where the original registration occurs
    // meaning this should only be called from the view
    // of the list of upcoming events

    $scope.registerForEvent = function(eventId){
      var ctfEvent = CtfEvents.get({ ctfEventId: eventId })
      ctfEvent.$promise.then(function(data) {
        ctfEvent.users.push($scope.userId)
        if($scope.authentication.user.roles.indexOf('teamCaptain') > -1){
          var teamKey = $scope.authentication.user.team;
          var teamListing = {};
          teamListing[teamKey] = $scope.authentication.user._id;
          ctfEvent.teams.push(teamListing);
          //for each user without a team we add to the captain's team
          // if they're a member and then we remove them from the list
          // of users without teams
        }
      else{
          //we assume that the user trying to register is a 'user'
          //this view should likely be limited only to users and captains
          // first check through the keys of the teams object to see if their
          // team is in that list if yes add them only to the teams array
          // otherwise add them to the users collection
        }
      });
        //commit ctfEvent to db
      ctfEvent.$update(function () {}, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }]);

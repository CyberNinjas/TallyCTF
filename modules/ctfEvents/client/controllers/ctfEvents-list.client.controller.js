'use strict';

angular.module('ctfEvents').controller('ListEventsController', ['$state','$scope','$stateParams', '$location', 'Teams', 'Authentication',
  'CtfEvents', function ($state, $scope, $stateParams, $location, Teams, Authentication, CtfEvents) {
    $scope.authentication = Authentication;
    $scope.userId = $scope.authentication.user._id
    $scope.ctfEvents = CtfEvents.query();

    $scope.isRegistered = function(ctfEvent){
      // hack: must return a non-empty string
      return ctfEvent.users.indexOf($scope.userId) > -1 ? 'ctfEvents.dashboard({ ctfEventId : ctfEvent._id })' : '-'
    }


    // This is where the original registration occurs
    // meaning this should only be called from the view
    // of the list of upcoming events

    $scope.registerForEvent = function(eventId){
      var ctfEvent = CtfEvents.get({ ctfEventId: eventId })
      ctfEvent.$promise.then(function(data) {
        ctfEvent.users.push($scope.userId)
        if($scope.authentication.user.roles.indexOf('teamCaptain') > -1){
          var newUsers = []
          var team = Teams.get({
            teamId: $scope.authentication.user.team
          });
          team.$promise.then(function(data) {
            var members = []
            for(var member= 0; member<team.members.length; member++){
              members.push(team.members[member]._id)
            }
            for(var user = 0; user<ctfEvent.users.length; user++){
              if(members.indexOf(ctfEvent.users[user]) > -1){
                newUsers.push(ctfEvent.users[user])
              }
            }
            ctfEvent.teams.push({ teamId: $scope.authentication.user.team, users: newUsers });
          })
          //for each user without a team we add to the captain's team
          // if they're a member and then we remove them from the list
          // of users without teams
        }
        else{
          for(var team = 0; team<ctfEvent.teams.length; team++){
            if(ctfEvent.teams[team].teamId === $scope.authentication.user.team){
              console.log('add me')
              ctfEvent.teams[team].users.push($scope.userId)
            }
            //we assume that the user trying to register is a 'user'
            //this view should likely be limited only to users and captains
            // first check through the keys of the teams object to see if their
            // team is in that list if yes add them only to the teams array
            // otherwise add them to the users collection
          }
        }
      })

        //commit ctfEvent to db
      ctfEvent.$update(function () {
        $location.path('ctfEvents/dash/' + ctfEvent._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }]);

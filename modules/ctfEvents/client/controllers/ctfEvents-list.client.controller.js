'use strict';

angular.module('ctfEvents').controller('ListEventsController', ['$state','$scope','$stateParams', '$location', 'Authentication',
  'CtfEvents', function ($state, $scope, $stateParams, $location, Authentication, CtfEvents) {
    $scope.authentication = Authentication;
    $scope.userId = $scope.authentication.user._id
    $scope.ctfEvents = CtfEvents.query();

    console.log($scope.ctfEvents)
    console.log($scope.authentication)

    $scope.register = function(eventId){
      var ctfEvent = CtfEvents.get({ ctfEventId: eventId })
      ctfEvent.$promise.then(function(data) {
        ctfEvent.users.push($scope.userId)
        /*if(roles.indexOf('teamCaptain') > -1){

        }
        else{
         if(ctfEvent.teams.indexOf($scope.authentication.team) > -1)

        }*/
        //commit ctfEvent to db
        ctfEvent.$update(function () {}, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      });
    };
  }
]);

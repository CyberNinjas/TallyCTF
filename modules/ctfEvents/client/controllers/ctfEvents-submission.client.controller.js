'use strict';
// angular.module('ctfEvents').controller('SubmissionController', ['$scope', '$filter', '$stateParams', '$state', '$location', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', 'Socket', '$q', 'formly', 'formlyBootstrap',
//   function ($scope, $filter, $stateParams, $state, $location, Authentication, CtfEvents, Challenges, Teams, Users, Socket, $q, formly, formlyBootstrap) {
angular.module('ctfEvents').controller('SubmissionController', ['$scope', '$filter', '$stateParams', '$state', '$location', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', 'Socket', '$q',
  function ($scope, $filter, $stateParams, $state, $location, Authentication, CtfEvents, Challenges, Teams, Users, Socket, $q) {

  $scope.authentication = Authentication;
  $q.all([
    Users.query().$promise,
    Challenges.query().$promise,
    CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise
  ]).then(function(data) {
    $scope.users = data[0];
    $scope.challenges = data[1];
    $scope.ctfEvent = data[2];
    return
  }).then(function() {
    $scope.eventId = $stateParams.ctfEventId
    angular.forEach($scope.challenges, function (challenge) {
      if(challenge._id === $stateParams.challengeId){
        $scope.currentChallenge = challenge;
      }
    })
  })

    $scope.model = {
      slider: 5,
      slider1: 0,
      slider2: 50,
    };

    $scope.fields = [
      {
        key: 'first_name',
        type: 'input',
        templateOptions: {
          type: 'text',
          label: 'Data',
          placeholder: 'Enter your data',
          required: true
        }
      },
      {
        key: 'nested.story',
        type: 'textarea',
        templateOptions: {
          label: 'Your answer',
          placeholder: ':-)',
          description: ''
        },
      },
      {
        key: 'slider',
        type: 'slider',
        templateOptions: {
          label: 'Slider',
          sliderOptions: {
            floor: 0,
            ceil: 100,
            translate: function(value) {
              return 'Username: ' + value + '%';
            }
          }
        }
      },
      {
        key: 'slider1',
        type: 'slider',
        templateOptions: {
          label: 'Slider',
          sliderOptions: {
            floor: 0,
            ceil: 100,
            translate: function(value) {
              return 'Username: ' + value + '%';
            }
          }
        }
      },
      {
        key: 'slider2',
        type: 'slider',
        templateOptions: {
          label: 'Slider',
          sliderOptions: {
            floor: 0,
            ceil: 100,
            translate: function(value) {
              return 'Username: ' + value + '%';
            }
          }
        }
      },
    ];

  $scope.submit = function(answer){

  }

  }])
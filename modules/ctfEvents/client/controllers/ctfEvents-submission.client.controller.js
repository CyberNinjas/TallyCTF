'use strict';
angular.module('ctfEvents').controller('SubmissionController', ['$scope', '$filter', '$stateParams', '$state', '$location', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', 'Socket', '$q',
  function ($scope, $filter, $stateParams, $state, $location, Authentication, CtfEvents, Challenges, Teams, Users, Socket, $q) {

  $scope.authentication = Authentication;
  $q.all([
    Users.query().$promise,
    Teams.query().$promise,
    Challenges.query().$promise,
    CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise
  ]).then(function(data) {
    $scope.users = data[0];
    $scope.teams = data[1];
    $scope.challenges = data[2];
    $scope.ctfEvent = data[3];
    return
  }).then(function() {
    $scope.eventId = $stateParams.ctfEventId
    angular.forEach($scope.challenges, function (challenge) {
      if(challenge._id === $stateParams.challengeId){
        $scope.currentChallenge = challenge;
        console.log($scope.currentChallenge)
      }
    })
    angular.forEach($scope.ctfEvent.teams, function (team) {
      if(team.members.indexOf(Authentication.user._id) > -1){
        $scope.currentTeam = team;
        $scope.sliderUsers = $scope.currentTeam.members.map(function (user) { return {"name": $scope.getUserName(user), "value": 0} })
        $scope.availableUsers = $scope.currentTeam.members.map(function (user) { return {"name": $scope.getUserName(user), "value": $scope.getUserName(user)} })
      }
    })
    $scope.model = {
      contributingUsers: [],
      selectedUsers: $scope.availableUsers,
      selects: [],
      texts: $scope.currentChallenge.answers
    };

    $scope.fields = [
      {
        key: 'nested.story',
        type: 'textarea',
        templateOptions: {
          label: 'Your answer',
          placeholder: ':-)',
          description: '',
        },
        hideExpression: "model.texts.length < 1",
      },
      {
        key: "selectedUsers",
        type: "multiCheckbox",
        className: 'multi-check',
        templateOptions: {
          label: "Your answer",
          options: $scope.model.answers,
        },
        hideExpression: "model.selects.length < 1",
      },
      {
        key: "selectedUsers",
        type: "multiCheckbox",
        className: 'multi-check',
        templateOptions: {
          label: "Contributing Users",
          options: $scope.model.selectedUsers,
          onClick: function($modelValue, $viewValue, scope, event) {
            var numberOfUsers = $scope.model.selectedUsers.length;
            var users = $scope.model.selectedUsers.map(function (user) {
              var portion = 100 / numberOfUsers;
              return {"name": user, "value": portion, "newVal": portion}
            })
            $scope.model.contributingUsers = users;
          }
        }
      },
      {
        type: "repeatSection",
        key: "contributingUsers",
        templateOptions: {
          fields: [
            {
              fieldGroup: [
                {
                  type: "slider",
                  key: "value",
                  templateOptions: {
                    sliderOptions: {
                      label: "userName",
                      floor: 0,
                      onClick: function($modelValue, $viewValue, scope, event) {
                        console.log($viewValue)
                      },
                      translate: function(value) {
                        return value + '%';
                      },
                      onEnd: function () {
                        var total = 0;
                        angular.forEach($scope.model.contributingUsers,function (user) {
                          total += user.value;
                        })
                      },
                    },
                    expressionProperties: {
                      'to.ceil': 44,
                    },
                  }
                },
              ]
            },
          ]
        }
      },
    ];

  })

    $scope.getUserName = function(id) {
      return $filter('filter')($scope.users, { _id: id })[0].displayName;
    }
    $scope.changeContributors = function($viewValue, $modelValue, $scope) {
        console.log($viewValue)
        console.log($modelValue)
    }
  $scope.submit = function(answer){ }
  }])
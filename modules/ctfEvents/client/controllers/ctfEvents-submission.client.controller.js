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
      selectedUsers: [],
      selects: [],
      texts: $scope.currentChallenge.answers
    };

    $scope.fields = [
      {
        key: 'answer',
        type: 'textarea',
        templateOptions: {
          label: 'Your answer',
          placeholder: ':-)',
          description: '',
        },
        hideExpression: "model.texts.length < 1",
      },
      {
        key: "answer",
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
          options: $scope.availableUsers,
          onClick: function($modelValue, $viewValue, scope, event) {
            var numberOfUsers = $scope.model.selectedUsers.length;
            var users = $scope.model.selectedUsers.map(function (user) {
              var portion = 100 / numberOfUsers;
              return {"name": user, "value": portion, "ceiling": portion}
            })
            $scope.model.contributingUsers = users;
          }
        },
        controller: function($scope) {
          $scope.model.selectedUsers.push(Authentication.user.displayName)
          $scope.model.contributingUsers.push({"name": Authentication.user.displayName, "value": 100, "ceiling": 100})
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
                      translate: function(value) {
                        return value + '%';
                      },
                      onEnd: function () {
                        var total = 0;
                        angular.forEach($scope.model.contributingUsers,function (user) {
                          total += user.value;
                        })

                        angular.forEach($scope.model.contributingUsers, function (user) {
                          user.value = (100 - (total - user.value))
                        })
                      },
                    },
                  },
                  expressionProperties: {
                    'templateOptions.sliderOptions.ceil': function($viewValue, $modelValue, scope) {
                      angular.forEach($scope.model.contributingUsers, function (user) {
                        if(user.value === $viewValue){
                          return user.ceiling
                        }
                      })
                    }
                  },
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
  $scope.changeContributors = function($viewValue, $modelValue, $scope) {}
  $scope.submit = function(answer){
    var submission = {}
    submission.team = $scope.currentTeam
    submission.contributors = $scope.model.contributingUsers
    submission.answer = $scope.model.answer
    angular.forEach($scope.ctfEvent.challenges, function (challenge, index) {
      if($scope.currentChallenge._id === challenge._id){
        $scope.ctfEvent.challenges[index].submissions.push(submission);
      }
    })
    // Save the submission here
  }
 }])
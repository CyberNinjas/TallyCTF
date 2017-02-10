'use strict';
angular.module('ctfEvents').controller('SubmissionController', ['$scope', '$controller', '$filter', '$stateParams', '$state', '$location', 'Authentication', 'CtfEvents', 'Users', 'Socket',
  function ($scope, $controller, $filter, $stateParams, $state, $location, Authentication, CtfEvents, Users, Socket) {

    $controller('BaseEventsController', {
      $scope: $scope
    });

    $scope.all.then(function () {
      CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise.then(function (data) {
        $scope.ctfEvent = data
        $scope.eventId = $stateParams.ctfEventId

        angular.forEach($scope.ctfEvent.challenges, function (challenge) {
          if (challenge._id === $stateParams.challengeId) {
            $scope.currentChallenge = challenge;
            $scope.model = {
              contributingUsers: [],
              selectedUsers: [],
              type: $scope.currentChallenge.challengeType,
              answers: $scope.currentChallenge.answers
            };
          }
        })

        angular.forEach($scope.ctfEvent.teams, function (team) {
          if (team.members.indexOf(Authentication.user._id) > -1) {
            $scope.currentTeam = team;
            $scope.sliderUsers = $scope.currentTeam.members.map(function (user) {
              return { 'name': $scope.getUserName(user), 'value': 0 }
            })
            $scope.availableUsers = $scope.currentTeam.members.map(function (user) {
              return { 'name': $scope.getUserName(user), 'value': $scope.getUserName(user) }
            })
          }
        })

        $scope.availableUsers = $scope.availableUsers ? $scope.availableUsers : [{ name: 'all', value: 'all' }]

        $scope.fields = [
          {
            key: 'answer',
            type: 'textarea',
            templateOptions: {
              label: 'Your answer',
              placeholder: ':-)',
              description: '',
            },
            hideExpression: 'model.type == "choice"',
          },
          {
            key: 'answer',
            type: 'multiCheckbox',
            className: 'multi-check',
            hideExpression: 'model.type == "text"',
            expressionProperties: {
              'templateOptions.options': function () {
                if($scope.model.type !== 'text'){
                  return $scope.model.answers.map(function (answer) {
                    answer.name = answer.value;
                    return answer
                  })
                }
              }
            },
            templateOptions: {
              label: 'Your answer',
            },
          },
          {
            key: 'selectedUsers',
            type: 'multiCheckbox',
            className: 'multi-check',
            templateOptions: {
              label: 'Contributing Users',
              options: $scope.availableUsers,
              onClick: function () {
                var numberOfUsers = $scope.model.selectedUsers.length;
                var users = $scope.model.selectedUsers.map(function (user) {
                  var portion = 100 / numberOfUsers;
                  return { 'name': user, 'value': portion, 'ceiling': portion }
                })
                $scope.model.contributingUsers = users;
              }
            },
            controller: function ($scope) {
              $scope.model.selectedUsers.push(Authentication.user.displayName)
              $scope.model.contributingUsers.push({
                'name': Authentication.user.displayName,
                'value': 100,
                'ceiling': 100
              })
            }
          },
          {
            type: 'repeatSection',
            key: 'contributingUsers',
            templateOptions: {
              fields: [
                {
                  fieldGroup: [
                    {
                      type: 'slider',
                      key: 'value',
                      templateOptions: {
                        sliderOptions: {
                          label: 'userName',
                          floor: 0,
                          translate: function (value) {
                            return value + '%';
                          },
                          onEnd: function () {
                            var total = 0;
                            angular.forEach($scope.model.contributingUsers, function (user) {
                              total += user.value;
                            })
                            angular.forEach($scope.model.contributingUsers, function (user) {
                              user.value = (100 - (total - user.value))
                            })
                          },
                        },
                      },
                      expressionProperties: {
                        'templateOptions.sliderOptions.ceil': function ($viewValue, $modelValue, scope) {
                          angular.forEach($scope.model.contributingUsers, function (user) {
                            if (user.value === $viewValue) {
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
    })

    /**
     * Gets a user name from a given user id
     * @param id
     */
    $scope.getUserName = function (id) {
      return $filter('filter')($scope.users, { _id: id })[0].displayName;
    }

    /**
     * Adds the submission object to the current challenges submissions and
     * updates the ctfEvent
     *
     * On submission the cache is invalidated, so that the scoring reflects
     * the new submission
     */
    $scope.submit = function () {
      var submission = {}
      submission.team = $scope.currentTeam
      submission.contributors = $scope.model.contributingUsers
      submission.answer = $scope.model.answer
      angular.forEach($scope.ctfEvent.challenges, function (challenge, index) {
        if ($scope.currentChallenge._id === challenge._id) {
          $scope.ctfEvent.challenges[index].submissions.push(submission);
        }
      })
      CtfEvents.update($scope.ctfEvent, function () {
        $scope.socket.emit('invalidate', { 'id': $scope.ctfEvent._id })
        $scope.socket.emit('invalidateAll')
        // Should add an alert for feedback on correct vs incorrect and stay or go depending
        $location.path('ctfEvents/dash/' + $scope.ctfEvent._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }
  }])

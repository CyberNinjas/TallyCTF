'use strict'

angular.module('challenges').controller('ChallengeUpdateController', ['$scope', '$stateParams', '$location', 'Authentication', '$http', 'filterFilter', 'Challenges',
  function ($scope, $stateParams, $location, Authentication, $http, filterFilter, Challenges) {
    $scope.authentication = Authentication
    $scope.id = $stateParams.challengeId || 'new'
    $http.get('/modules/challenges/client/config/challengeTypes.json').then(
      function (res) {
        $scope.challengeTypes = res.data
      }
    )

    $scope.model = {answers: []};
    $scope.challenge = Challenges.get({ challengeId: $scope.id })
    $scope.challenge.$promise.then(function () {
    $scope.model.type = $scope.challenge.challengeType
    //Placeholder to be populated with user data
    $scope.machines = ['AWS', 'Azure', 'Heroku', 'Local'].map(function (machine) {
      return {name: machine, value: machine}
    })


    $scope.fields = [
      {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-4',
            type: 'input',
            key: 'name',
            templateOptions: {
              label: 'Name'
            }
          },
          {
            className: 'col-xs-4',
            type: 'input',
            key: 'points',
            templateOptions: {
              label: 'Points'
            }
          },
          {
            className: 'col-xs-4',
            type: 'input',
            key: 'category',
            templateOptions: {
              label: 'Category'
            },
          }
        ]
      },
      {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-12',
            type: 'textarea',
            key: 'description',
            templateOptions: {
              label: 'Description'
            }
          }
        ]
      },
       {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-4',
            type: 'select',
            key: 'machine',
            templateOptions: {
              label: 'Affected Machine',
              options: $scope.machines
            }
          },
          {
            className: 'col-xs-4',
            type: 'select',
            key: 'type',
            templateOptions: {
              label: 'Challenge Type',
              options: $scope.challengeTypes
            }
          },
          {
            className: 'col-xs-4',
            type: 'select',
            key: 'format',
            templateOptions: {
              label: 'Challenge Format',
            },
            expressionProperties: {
              'templateOptions.options': function () {
                return $scope.challengeTypes.filter(function (type) {
                  return type.value === $scope.model.type;
                })[0].formats
              }
            }
          }
        ]
      },
      {
        className: 'row',
        fieldGroup: [
          {
            className: 'col-xs-12',
            key: 'answers',
            type: 'multiInput',
            templateOptions: {
              label: 'Answers',
              inputOptions: {
                type: 'input'
              }
            },
            expressionProperties: {
              'templateOptions.disabled': 'model.format === checkbox'
            }
          }
        ]
      }
    ];
   })

    $scope.updateOrCreate = function (isValid) {
      $scope.error = ''
      this.addAnswer()
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'challengeForm')
        return false
      }
      $scope.challenge.challengeType = $scope.challenge.type.name
      $scope.challenge.challengeFormat = $scope.challenge.format.name
      $scope.challenge._id = $scope.id
      delete $scope.challenge.formats
      $scope.challenge.$save(function (response) {
        $location.path('challenges')
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message
      })
    }

    $scope.removeChallenge = function () {
      if (confirm('Are you sure you want to delete the challenge?')) {
        $scope.challenge.$remove(function () {
          $location.path('challenges')
        })
      }
    }
  }])

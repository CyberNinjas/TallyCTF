'use strict'

angular.module('challenges').controller('ChallengeUpdateController', ['$scope', '$stateParams', '$location', 'Authentication', '$http', 'filterFilter', 'Challenges', 'ChallengeForm',
  function ($scope, $stateParams, $location, Authentication, $http, filterFilter, Challenges, ChallengeForm) {
    $scope.authentication = Authentication
    $scope.id = $stateParams.challengeId || 'new'
    $http.get('/modules/challenges/client/config/challengeTypes.json').then(
      function (res) {
        $scope.challengeTypes = res.data
      }
    )

    $scope.model = { answers: [] };
    $scope.challenge = Challenges.get({ challengeId: $scope.id })
    $scope.challenge.$promise.then(function () {
      $scope.model.type = $scope.challenge.challengeType
      $scope.model.submissions = $scope.challenge.numberOfSubmissions || $scope.challengeTypes.filter(function (type) {
        return $scope.model.type === type.value
      })[0].submissions

      $scope.model.category = $scope.challenge.category
      $scope.model.description = $scope.challenge.description
      $scope.model.name = $scope.challenge.name
      $scope.model.points = $scope.challenge.points
      $scope.model.machine = $scope.challenge.affectedMachine
      $scope.model.answers = $scope.challenge.answers.map(function (answer) {
        return answer.value
      })

      //Placeholder to be populated with user data
      $scope.machines = ['AWS', 'Azure', 'Heroku', 'Local'].map(function (machine) {
        return { name: machine, value: machine }
      })

      var formats = $scope.challengeTypes.filter(function (type) {
        return type.value === $scope.model.type;
      })[0].formats

      $scope.model.formats = formats
      $scope.fields = ChallengeForm.createForm($scope, $scope.challenge, $scope.challengeTypes, $scope.machines)
      $scope.model.format = $scope.challenge.challengeFormat
    })

    $scope.updateOrCreate = function (isValid) {
      $scope.challenge.name = $scope.model.name
      $scope.challenge.description = $scope.model.description
      $scope.challenge.challengeType = $scope.model.type
      $scope.challenge.points = $scope.model.points
      $scope.challenge.challengeFormat = $scope.model.format
      $scope.challenge.category = $scope.model.category
      $scope.challenge.affectedMachine = $scope.model.machine
      $scope.challenge.numberOfSubmissions = $scope.model.submissions
      $scope.challenge._id = $scope.id
      Challenges.update($scope.challenge, function (response) {
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

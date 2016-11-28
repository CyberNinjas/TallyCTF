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

    $scope.challenge = Challenges.get({ challengeId: $scope.id })
    $scope.challenge.$promise.then(function () {
      $scope.challenge.type = $scope.challengeTypes.filter(function (obj) {
        return obj.name === $scope.challenge.challengeType
      })[0]
      $scope.updateType()
      $scope.challenge.format = $scope.challenge.formats.filter(function (obj) {
        return obj.name === $scope.challenge.challengeFormat
      })[0]
      $scope.updateFormat()
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

    $scope.updateType = function () {
      if ($scope.challenge.type.name === 'text') {
        angular.forEach($scope.challenge.answers, function (answer) {
          answer.isCorrect = true
        })
      }
      $scope.challenge.formats = $scope.challengeTypes.filter(function (obj) {
        return obj.name === $scope.challenge.type.name
      })[0].formats
      var format = $scope.challenge.formats[Object.keys($scope.challenge.formats)[0]]

      $scope.challenge.format = $scope.challenge.formats.filter(function (obj) {
        return obj.name === format.name
      })[0]
    }

    $scope.updateFormat = function () {
      if ($scope.challenge.format && $scope.challenge.format.requiredAnswers && $scope.challenge.format.requiredAnswers.length > 0) {
        $scope.challenge.answers = angular.copy($scope.challenge.format.requiredAnswers)
        $scope.allowAddAnswers = false
      } else {
        $scope.allowAddAnswers = true
      }
    }

    $scope.existsCorrectAnswer = function () {
      if (!$scope.challenge || !$scope.challenge.answers || $scope.challenge.answers.length < 1) {
        return false
      }
      var correctAnswers = filterFilter($scope.challenge.answers, { isCorrect: true })
      return (correctAnswers.length > 0)
    }

    $scope.removeChallenge = function () {
      if (confirm('Are you sure you want to delete the challenge?')) {
        $scope.challenge.$remove(function () {
          $location.path('challenges')
        })
      }
    }

    $scope.addAnswer = function () {
      if (!$scope.answerValue) {
        return
      }
      if (!$scope.challenge.answers) {
        $scope.challenge.answers = []
      }
      $scope.challenge.answers.push({
        value: $scope.answerValue,
        isRegex: false,
        isCorrect: ($scope.challenge.type.name === 'text')
      })
      $scope.answerValue = ''
    }

    $scope.removeAnswer = function (index) {
      if (typeof index !== 'undefined') {
        $scope.challenge.answers.splice(index, 1)
      }
    }

    $scope.toggleAnswerRegEx = function (index) {
      if (!$scope.challenge || !$scope.challenge.answers || !$scope.challenge.answers[index]) {
        return
      }
      $scope.challenge.answers[index].isRegex = !$scope.challenge.answers[index].isRegex
    }
  }])

'use strict'

angular.module('challenges').controller('ChallengeListController', ['$scope', '$stateParams', '$location', 'Authentication', 'Challenges',
  function ($scope, $stateParams, $location, Authentication, Challenges) {
    $scope.authentication = Authentication

    $scope.challengeTypes = {
      'multiple-choice': 'Multiple-Choice',
      'true-false': 'True/False',
      'short-answer': 'Short Answer',
      'long-answer': 'Long Answer'
    }

    $scope.challenges = Challenges.query()
    $scope.challenges.$promise.then(function () {
      console.log($scope.challenges)
    })

    $scope.sortType = 'name'
    $scope.reverseSort = false

    $scope.sort = function (p) {
      if ($scope.sortType === p) {
        $scope.reverseSort = !$scope.reverseSort
      } else {
        $scope.sortType = p

        if ($scope.sortType === 'points') {
          $scope.reverseSort = true
        } else {
          $scope.reverseSort = false
        }
      }
    }
  }])

'use strict'

angular.module('challenges').controller('ChallengeListController', ['$scope', '$stateParams', '$location', 'Authentication', 'Challenges',
  function ($scope, $stateParams, $location, Authentication, Challenges) {

    $scope.authentication = Authentication
    $scope.user = Authentication.user
    $scope.challenges = Challenges.query()

    $scope.sortType = 'name'
    $scope.reverseSort = false

    /**
     * Identifies whether or not the sortType has changed
     * Sets the sort type and negates reverseSort if no change has occurred
     * @param type - The selected table header to be sorted on
     */

    $scope.sort = function (type) {
      var changed = $scope.sortType !== type;
      $scope.sortType = type;
      $scope.reverseSort = changed ? $scope.reverseSort : !$scope.reverseSort;
    }
  }])

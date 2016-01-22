'use strict';

// Challenges controller
angular.module('challenges').controller('ChallengeUpdateController', ['$scope', '$stateParams', '$location', 'Authentication', 'Challenges', '$http', 'ScoreBoard',
  function ($scope, $stateParams, $location, Authentication, Challenges, $http, ScoreBoard) {
    $scope.authentication = Authentication;
    $scope.challengeTypes = {   'multiple-choice' : "Multiple-Choice",
                                'true-false' : "True/False",
                                'short-answer' : "Short Answer",
                                'long-answer' : "Long Answer"
                            };
    $scope.id = $stateParams.challengeId || 'new';
    $scope.challenge = Challenges.get({ challengeId : $scope.id });
    $scope.defaultType = $scope.challenge.type;

    // Create new Challenge or Updates a Challenge
    $scope.updateOrCreate = function (isValid) {
        $scope.error = "";
        this.addFlag();
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'challengeForm');
            return false;
        }

        // Redirect after save
        $scope.challenge[$stateParams.challengeId ? '$update' : '$create'](function (response) {
            $location.path('challenges');

        }, function (errorResponse) {
            //if there's an error, set it in browser
            $scope.error = errorResponse.data.message;
        });
    };

    /**
     * Asks the user to confirm decision before deleting the challenge.
     *
     **/
    $scope.confirmDelete = function(){
      if(confirm('Are you sure you want to delete?'))
        $scope.remove();
    };

    // Remove existing Challenge
    $scope.remove = function () {
      $scope.challenge.$remove(function () {
        $location.path('challenges');
      });
    };

    // Adds a flag to the set of possible flags
    $scope.addFlag = function (chall) {
        var challenge = (chall ? chall : $scope);

        if (!$scope.flagValue)
            return;

        //add flag to flags array
        $scope.challenge.flags.push({ flag: $scope.flagValue, regex: false });
        $scope.flagValue = "";

    };

    // Removes a flag from the set of flags
    $scope.removeFlag = function (index, chall) {
      var challenge = (chall ? chall : $scope);
      if (index < 0)
        return;

      challenge.flags.splice(index, 1);
    };

    // Changes a flag type between being regex and being a string literal
    $scope.toggleRegEx = function (flag) {
      if (!flag)
        return;

      flag.regex = !flag.regex;
    };

  }]);

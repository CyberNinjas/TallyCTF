'use strict';

// Challenges controller
angular.module('challenges').controller('ChallengesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Challenges', '$http', 'ScoreBoard',
  function ($scope, $stateParams, $location, Authentication, Challenges, $http, ScoreBoard) {
    $scope.authentication = Authentication;
    $scope.challengeTypes = {
      'multiple-choice': 'Multiple-Choice',
      'true-false': 'True/False',
      'short-answer': 'Short Answer',
      'long-answer': 'Long Answer'
    };

    $scope.challenge = Challenges.get({ challengeId: $stateParams.challengeId || 'new' });

    $scope.defaultType = $scope.challenge.type;

    // Find a list of Challenges
    $scope.find = function () {
      $scope.challenges = Challenges.query();

      // If the user is on a team, get list of all solved challenges by them
      if (Authentication.user && Authentication.user.team) {

        // Initialize the arrays that will hold the solved IDs
        $scope.teamSolvedChallenges = [];

        //retrieve the team's scoreboard, to cross-reference team's solved challenges
        $scope.teamScoreBoard = ScoreBoard.get({ scoreBoardTeamId: Authentication.user.team });

        // Check the team's solved challenges only once promise is fulfilled
        $scope.teamScoreBoard.$promise.then(function (scoreboard) {

          //populate scope's teamSolveChallenges array with solved challenge id's
          for (var chall = 0; chall < scoreboard.solved.length; chall++) {
            $scope.teamSolvedChallenges.push(scoreboard.solved[chall].challengeId._id);
          }

          // Update the local scope of challenges to match the team's solved list
          $scope.challenges.$promise.then(function (challenges) {

            //iterate over whole challengeboard, comparing id's against solved ones
            for (var i = 0; i < $scope.challenges.length; ++i) {

              //and mark solved if it is so.
              if ($scope.teamSolvedChallenges.indexOf($scope.challenges[i]._id) > -1)
                $scope.challenges[i].solved = true;
            }
          });
        });
      }
    };

    //set default values for sortType and reverseSort
    $scope.sortType = 'name';
    $scope.reverseSort = false;

    //method to set and toggle sort-per-column
    $scope.sort = function (p) {
      //if sort type is already set, simply reverse it
      if ($scope.sortType === p) {
        $scope.reverseSort = !$scope.reverseSort;
      } else {
        $scope.sortType = p;

        if ($scope.sortType === 'points') {
          $scope.reverseSort = true;
        } else {
          $scope.reverseSort = false;
        }
      }
    };

    // Submits an answer in the hope that it is correct
    $scope.submitItem = function (challenge) {
      //makes a request to backend submit challenge response
      Challenges.submit(null, challenge, function (response) {
        // On successful submit; successful submit includes incorrect answers, and returns appropriate message
        challenge.solve = null;
        $scope.success = response.message;
        challenge.solves = response.solves;
        challenge.solved = response.solved;
        alert(response.message + '!');
        //after successful submit, clear submission field and display any error messages
      }, function (response) {
        challenge.solve = null;
        $scope.error = response.message;
      });
    };
  }]);

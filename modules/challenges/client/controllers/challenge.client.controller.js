'use strict';

// Challenges controller
angular.module('challenges').controller('ChallengesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Challenges', '$http', 'ScoreBoard',
  function ($scope, $stateParams, $location, Authentication, Challenges, $http, ScoreBoard) {
    $scope.authentication = Authentication;
    $scope.challengeTypes = {   'multiple-choice' : "Multiple-Choice",
                                'true-false' : "True/False",
                                'short-answer' : "Short Answer",
                                'long-answer' : "Long Answer"
                            };

    $scope.challenge = Challenges.get({challengeId : $stateParams.challengeId || 'new' });

    $scope.defaultType = $scope.challenge.type;

    // Create new Challenge
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

            // Clear form fields
            $scope.challenge = Challenges.get({challengeId : 'new' });

        }, function (errorResponse) {
            //if there's an error, set it in browser
            $scope.error = errorResponse.data.message;
        });
    };

    // Remove existing Challenge
    $scope.remove = function (challenge) {
      if (challenge) {
        //remove challenge from backend
        challenge.$remove();

        //remove challenge from displayed list of challenges in browser
        for (var i in $scope.challenges) {
          if ($scope.challenges[i] === challenge) {
            $scope.challenges.splice(i, 1);
          }
        }
      } else {
        $scope.challenge.$remove(function () {
          $location.path('challenges');
        });
      }
    };

    // Set of utility methods to facilitate the hiding and showing of elements based on role
    $scope.displaySubmit = function(){
      var mroles = Authentication.user.roles;
      if (mroles.indexOf('admin') > -1) {
        return false;
      } else if(mroles.indexOf('guest') > -1) {
        return false;
      } else {
        return true;
      }
    };
    //method used to exclude a user role for element display
    $scope.displayExclude = function(role) {
      var mroles = Authentication.user.roles;
      if (mroles.indexOf(role) > -1) {
        return false;
      } else {
        return true;
      }
    };
    //method used to include a user role for element display
    $scope.displayInclude = function(role){
      var mroles = Authentication.user.roles;
      if (mroles.indexOf(role) > -1){
        return true;
      } else {
        return false;
      }
    };

    //method to confirm deletion of team on frontend
    $scope.confirmDelete = function(challenge) {
      if(confirm('Are you sure you want to delete?')){
        console.log('challenge delete');
        $scope.remove(challenge);
      }

    };

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
        $scope.teamScoreBoard.$promise.then(function (scoreboard){

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
    $scope.sort = function(p) {
      //if sort type is already set, simply reverse it
      if ($scope.sortType === p) {
        $scope.reverseSort = !$scope.reverseSort;
      } else {
        $scope.sortType = p;
        
        if ($scope.sortType === 'points'){
          $scope.reverseSort = true;
        } else {		 
          $scope.reverseSort = false;
        }
      }
    };

    // Submits an answer in the hope that it is correct
    $scope.submitItem = function(challenge){
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

'use strict';

// Challenges controller
angular.module('challenges').controller('ChallengesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Challenges', '$http', 'ScoreBoard',
  function ($scope, $stateParams, $location, Authentication, Challenges, $http, ScoreBoard) {
    $scope.authentication = Authentication;
    $scope.flags = [];

    // Create new Challenge
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'challengeForm');

        return false;
      }

      // Create new Challenge object
      var challenge = new Challenges({
        name: this.name,
        description: this.description,
        solves: 0,
        category: this.category,
        points: this.points,
        flags: this.flags
      });

      // Redirect after save
      challenge.$save(function (response) {
        $location.path('challenges');

        // Clear form fields
        $scope.name = '';
        $scope.description = '';
        $scope.solves = '';
        $scope.category = '';
        $scope.points = '';
        $scope.flag = '';
        $scope.flags = [];
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Challenge
    $scope.remove = function (challenge) {
      if (challenge) {
        challenge.$remove();

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
    //have role 'teamMember', 'user'
    //exclude 'teamcaptain' && include 'user'
    $scope.displayExclude = function(role) {
      var mroles = Authentication.user.roles;
      if (mroles.indexOf(role) > -1) {
        return false;
      } else {
        return true;
      }
    };
    $scope.displayInclude = function(role){
      var mroles = Authentication.user.roles;
      if (mroles.indexOf(role) > -1){
        return true;
      } else {
        return false;
      }
    };

    // Update existing Challenge
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'challengeForm');

        return false;
      }

      var challenge = $scope.challenge;

      challenge.$update(function () {
        $location.path('challenges');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Challenges
    $scope.find = function () {
      //Challenges will not be visible to participants unless event has started AND not ended.
      //if event has started AND not ended:
      $scope.challenges = Challenges.query();

      // If the user is on a team, get list of all solved challenges by them
      if (Authentication.user && Authentication.user.team) {
        // Initialize the arrays that will hold the solved IDs
        $scope.teamSolvedChallenges = [];
        $scope.teamScoreBoard = ScoreBoard.get({scoreBoardTeamId: Authentication.user.team});

        // Check the team's solved challenges
        $scope.teamScoreBoard.$promise.then(function (scoreboard){
          for (var chall = 0; chall < scoreboard.solved.length; chall++) {
            $scope.teamSolvedChallenges.push(scoreboard.solved[chall].challengeId._id);
          }

          // Update the local scope of challenges to match the team's solved list
          $scope.challenges.$promise.then(function (challenges) {
            for (var i = 0; i < $scope.challenges.length; ++i) {
              if ($scope.teamSolvedChallenges.indexOf($scope.challenges[i]._id) > -1)
                $scope.challenges[i].solved = true;
            }
          });
        });
      }
    };

    // Find existing Challenge
    $scope.findOne = function () {
      $scope.challenge = Challenges.get({
        challengeId: $stateParams.challengeId
      });
    };
	
    $scope.sortType = "name";
    $scope.reverseSort = false;  

    $scope.sort = function(p) {
     if ($scope.sortType === p) {
        $scope.reverseSort = !$scope.reverseSort;
      } else {
        $scope.sortType = p;
        
        if ($scope.sortType === "points"){
          $scope.reverseSort = true;
        } else {		 
          $scope.reverseSort = false;
        }
      }
    };

    // Submits an answer in the hope that it is correct
    $scope.submitItem = function(challenge){
      Challenges.submit(null, challenge, function (response) {
        // On successful submit
        challenge.solve = null;
        $scope.success = response.message;
        challenge.solves = response.solves;
        challenge.solved = response.solved;
        alert(response.message + '!');
      }, function (response) {
        challenge.solve = null;
        $scope.error = response.message;
      });
    };

  // Adds a flag to the set of possible flags
  $scope.addFlag = function (chall) {
    var challenge = (chall ? chall : $scope);

    if (!$scope.flag)
      return;

    challenge.flags.push({flag: $scope.flag, regex: false});
    challenge.flag = '';
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

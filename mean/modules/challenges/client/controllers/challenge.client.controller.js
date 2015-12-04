'use strict';

// Challenges controller
angular.module('challenges').controller('ChallengesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Challenges', '$http', 'ScoreBoard',
  function ($scope, $stateParams, $location, Authentication, Challenges, $http, ScoreBoard) {
    $scope.authentication = Authentication;

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
        flag: this.flag
      });

      // Redirect after save
      challenge.$save(function (response) {
        $location.path('challenges');
        //$location.path('challenges/' + response._id);

        // Clear form fields
        $scope.name= '';
        $scope.description= '';
        $scope.solves= '';
        $scope.category= '';
        $scope.points= '';
        $scope.flag = '';
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

    $scope.displaySubmit = function(){
      var mroles = Authentication.user.roles;
      if (mroles.indexOf('admin') > -1){
        return false;
      }
      else if(mroles.indexOf('guest') > -1){
        return false;
      }
      else return true;
    };
    //have role 'teamMember', 'user'
    //exclude 'teamcaptain' && include 'user'
    $scope.displayExclude = function(role){
      var mroles = Authentication.user.roles;
      if (mroles.indexOf(role) > -1){
        return false;
      }
      else return true;
    };
    $scope.displayInclude = function(role){
      var mroles = Authentication.user.roles;
      if (mroles.indexOf(role) > -1){
        return true;
      }
      else return false;
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
        $location.path('challenges/' + challenge._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Challenges
    $scope.find = function () {
      //Challenges will not be visible to participants unless event has started AND not ended.
      //if event has started AND not ended:
      $scope.challenges = Challenges.query();
      if (Authentication.user && Authentication.user.team){
        $scope.teamSolvedChallenges = ScoreBoard.get({scoreBoardTeamId: Authentication.user.team});
        console.log($scope.teamSolvedChallenges);
      }
      //$scope.challenges =[];
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
     } 
	 else {
         $scope.sortType = p;
         if ($scope.sortType === "points"){
           $scope.reverseSort = true;
         }
         else{		 
           $scope.reverseSort = false;
		 }
     }
 };
 //$scope.item = {};
 $scope.submitItem = function(challenge){
   var flag = challenge.solve;
   console.log(flag);
   console.log(challenge);

   $http.post('/api/challenges/submit', {challenge: challenge, flag: flag}).success(function (response) {
     challenge.solve = null;
     $scope.success = response.message;
     challenge.solves = response.solves;
     alert(response.message + '!');
     console.log("Success" + response.message);
   }).error(function (response){
     challenge.solve = null;
     $scope.error = response.message;
     console.log("Error" + response.message);
   });

    //if (challenge.val === challenge.name){
    //console.log("yes");
	//}
	//else{
	//console.log("no");
	//}
  };
  }
]);

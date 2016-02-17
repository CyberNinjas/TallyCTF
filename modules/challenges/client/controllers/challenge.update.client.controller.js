'use strict';

// Challenges controller
angular.module('challenges').controller('ChallengeUpdateController', ['$scope', '$stateParams', '$location', 'Authentication', '$http', 'filterFilter', 'Challenges',
  function ($scope, $stateParams, $location, Authentication, $http, filterFilter, Challenges) {
    $scope.authentication = Authentication;

    //Get ChallengeTypes
    $http.get('/modules/challenges/client/config/challengeTypes.json').then(
        function(res){
            $scope.challengeTypes = res.data;
        }
    );

    //Initialize the Resource
    $scope.id = $stateParams.challengeId || 'new';
    $scope.challenge = Challenges.get({ challengeId : $scope.id });
    $scope.challenge.$promise.then(function(){//Find and select the values returned for the object.
        $scope.challenge.type = $scope.challengeTypes.filter(  function ( obj ) { return obj.name === $scope.challenge.challenge_type; })[0];
        $scope.updateType();
        $scope.challenge.format = $scope.challenge.type.formats.filter(  function ( obj ) { return obj.name === $scope.challenge.challenge_format; })[0];
        $scope.updateFormat();
    });

    // Create new Challenge or Updates a Challenge
    $scope.updateOrCreate = function (isValid) {
        $scope.error = "";
        this.addAnswer();
        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'challengeForm');
            return false;
        }

        //Pull values out before clean-up
        $scope.challenge.challenge_type = $scope.challenge.type.name;
        $scope.challenge.challenge_format = $scope.challenge.format.name;
        $scope.challenge._id = $scope.id;

        //Clean-Up Un-Needed Fields
        delete $scope.challenge.type;
        delete $scope.challenge.format;

        // Redirect after save
        $scope.challenge.$save(function (response) {
            $location.path('challenges');

        }, function (errorResponse) {
            //if there's an error, set it in browser
            $scope.error = errorResponse.data.message;
        });
    };

    // Remove the Current Challenge
    $scope.removeChallenge = function () {
        if(confirm('Are you sure you want to delete the challenge?')) {
            $scope.challenge.$remove(function () {
                $location.path('challenges');
            });
        }
    };

      /**
       *
       */
      $scope.updateType = function(){
        $scope.challenge.format = "";

        //If text, set isCorrect answer to true on all since that's appropriate.
        if($scope.challenge.type.name == "text")
          angular.forEach($scope.challenge.answers,function(answer){ answer.isCorrect = true; });

      }
    /**
      *
     */
    $scope.updateFormat = function(){
        //Check to see if this is a type where only the pre-defined options should be allowed.
        if($scope.challenge.format && $scope.challenge.format.requiredAnswers && $scope.challenge.format.requiredAnswers.length > 0) {
            $scope.challenge.answers = angular.copy($scope.challenge.format.requiredAnswers);
            $scope.allowAddAnswers = false;
        } else {
            $scope.allowAddAnswers = true;
        }


    }

    /**
      * existsCorrectAnswer - Returns true if a correct answer is within the answers array.
    */
    $scope.existsCorrectAnswer = function(){
        //If answers not set, or its length is 0, there is not a correct answer
        if(!$scope.challenge || !$scope.challenge.answers || $scope.challenge.answers.length < 1)
            return false;
        //Otherwise grab the answers that have isCorrect set to true
        var correctAnswers = filterFilter($scope.challenge.answers, { isCorrect:true });
        return (correctAnswers.length > 0) ? true : false; //Return true if more than one.
    };

    //Adds a Possible Answer to the list of answers.
    $scope.addAnswer = function(){
        if(!$scope.answerValue)
            return;
        if(!$scope.challenge.answers)//Define if not set yet.
            $scope.challenge.answers = [];

        //Create Answer with Default Regex / Correct Values. Will always be isCorrect if Text
        $scope.challenge.answers.push({ value       :   $scope.answerValue,
                                        isRegex     :   false,
                                        isCorrect   :   ($scope.challenge.type.name == "text") ? true : false});
        $scope.answerValue = "";
    };

    // Removes an Answer from the Possible Answers.
    $scope.removeAnswer = function (index) {
        if (typeof index === 'undefined')
            return;
        $scope.challenge.answers.splice(index,1);
    };

    // Changes a flag type between being regex and being a string literal
    $scope.toggleAnswerRegEx = function (index) {
        if (!$scope.challenge || !$scope.challenge.answers || !$scope.challenge.answers[index])
            return;
        $scope.challenge.answers[index].isRegex = !$scope.challenge.answers[index].isRegex;
    };

  }]);

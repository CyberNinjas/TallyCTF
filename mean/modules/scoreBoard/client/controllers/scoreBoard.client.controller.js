'use strict';

// ScoreBoard controller
angular.module('scoreBoard').controller('ScoreBoardController', ['$scope', '$stateParams', '$location', 'Authentication', 'ScoreBoard',
  function ($scope, $stateParams, $location, Authentication, ScoreBoard) {
    $scope.authentication = Authentication;

    // Create new ScoreBoard
    $scope.create = function (isValid) {
      // Create new ScoreBoard object
      var scoreBoard = new ScoreBoard({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      scoreBoard.$save(function (response) {
        $location.path('scoreBoard/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing ScoreBoard
    $scope.remove = function (scoreBoard) {
      scoreBoard.$remove();

      for (var i in $scope.scoreBoard) {
        if ($scope.scoreBoard[i] === scoreBoard) {
          $scope.scoreBoard.splice(i, 1);
        }
      }
    };

    // Update existing Score Board
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'scoreBoardForm');

        return false;
      }

      var scoreBoard = $scope.scoreBoard;

      scoreBoard.$update(function () {
        $location.path('scoreBoard/' + scoreBoard._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of ScoreBoard
    $scope.find = function () {
      $scope.scoreBoard = ScoreBoard.query();
    };

    // Find existing ScoreBoard
    $scope.findOne = function () {
      $scope.scoreBoard = ScoreBoard.get({
        scoreBoardId: $stateParams.scoreBoardId
      });
    };
  }
]);

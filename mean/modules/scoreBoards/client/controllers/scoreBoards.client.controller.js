'use strict';

// ScoreBoards controller
angular.module('scoreBoards').controller('ScoreBoardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ScoreBoards',
  function ($scope, $stateParams, $location, Authentication, ScoreBoards) {
    $scope.authentication = Authentication;

    // Create new ScoreBoard
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'scoreBoardForm');

        return false;
      }

      // Create new ScoreBoard object
      var scoreBoard = new ScoreBoards({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      scoreBoard.$save(function (response) {
        $location.path('scoreBoards/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing ScoreBoard
    $scope.remove = function (scoreBoard) {
      if (scoreBoard) {
        scoreBoard.$remove();

        for (var i in $scope.scoreBoards) {
          if ($scope.scoreBoards[i] === scoreBoard) {
            $scope.scoreBoards.splice(i, 1);
          }
        }
      } else {
        $scope.scoreBoard.$remove(function () {
          $location.path('scoreBoards');
        });
      }
    };

    // Update existing ScoreBoard
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'scoreBoardForm');

        return false;
      }

      var scoreBoard = $scope.scoreBoard;

      scoreBoard.$update(function () {
        $location.path('scoreBoards/' + scoreBoard._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of ScoreBoards
    $scope.find = function () {
      $scope.scoreBoards = ScoreBoards.query();
    };

    // Find existing ScoreBoard
    $scope.findOne = function () {
      $scope.scoreBoard = ScoreBoards.get({
        scoreBoardId: $stateParams.scoreBoardId
      });
    };
  }
]);

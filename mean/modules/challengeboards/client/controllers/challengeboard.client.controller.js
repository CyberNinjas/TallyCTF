'use strict';

// Challengeboards controller
angular.module('challengeboards').controller('ChallengeboardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Challengeboards',
  function ($scope, $stateParams, $location, Authentication, Challengeboards) {
    $scope.authentication = Authentication;

    // Create new Challengeboard
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'challengeboardForm');

        return false;
      }

      // Create new Challengeboard object
      var challengeboard = new Challengeboards({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      challengeboard.$save(function (response) {
        $location.path('challengeboards/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Challengeboard
    $scope.remove = function (challengeboard) {
      if (challengeboard) {
        challengeboard.$remove();

        for (var i in $scope.challengeboards) {
          if ($scope.challengeboards[i] === challengeboard) {
            $scope.challengeboards.splice(i, 1);
          }
        }
      } else {
        $scope.challengeboard.$remove(function () {
          $location.path('challengeboards');
        });
      }
    };

    // Update existing Challengeboard
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'challengeboardForm');

        return false;
      }

      var challengeboard = $scope.challengeboard;

      challengeboard.$update(function () {
        $location.path('challengeboards/' + challengeboard._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Challengeboards
    $scope.find = function () {
      $scope.challengeboards = Challengeboards.query();
    };

    // Find existing Challengeboard
    $scope.findOne = function () {
      $scope.challengeboard = Challengeboards.get({
        challengeboardId: $stateParams.challengeboardId
      });
    };
  }
]);

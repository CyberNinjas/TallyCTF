'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location','Teams','Authentication','Users',
  function ($scope, $stateParams, $location, Teams, Authentication, Users) {
    $scope.authentication = Authentication.user;
    $scope.users = Users;
    $scope.tasks = [];
    
    // Create new Team
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'teamForm');

        return false;
      }

      // Create new Team object
      // attributes for team:
      // user array
      // team captain
      // team picture
      var team = new Teams({
        teamName: this.teamName
      });

    Authentication.user.team= this.teamName;

    // Redirect after save
      team.$save(function (response) {
        // Clear form fields
        $scope.teamName = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      var user = new Users($scope.authentication);

      //Update user function
      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
  };


  //Redirect the createTeam to adding users
  $scope.teamRoster = function(){
    $location.path('/teams/addusers');
  };

  $scope.add = function() {
        $scope.tasks.push($scope.title);
    }
  $scope.delete = function() {
      $scope.tasks.splice(this.$index, 1);
  };

    // Remove existing Team
    $scope.remove = function (team) {
      if (team) {
        team.$remove();

        for (var i in $scope.teams) {
          if ($scope.teams[i] === team) {
            $scope.teams.splice(i, 1);
          }
        }
      } else {
        $scope.team.$remove(function () {
          $location.path('teams');
        });
      }
    };



    // Update existing Team
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'teamForm');

        return false;
      }


      var team = $scope.team;

      team.$update(function () {
        $location.path('teams/' + team._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Teams
    $scope.find = function () {
      $scope.teams = Teams.query();
    };

    // Find existing Team
    $scope.findOne = function () {
      $scope.team = Teams.get({
        teamId: $stateParams.teamId
      });
    };
  }
]);

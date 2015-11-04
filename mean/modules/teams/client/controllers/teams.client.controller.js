'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location','Teams','Authentication','Users',
  function ($scope, $stateParams, $location, Teams, Authentication, Users) {
    $scope.authentication = Authentication.user;
    $scope.users = Users;
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
        teamName: this.teamName,
        members: (Authentication.user.username)
      });
     // team.members.push(Authentication.user);
    Authentication.user.team= this.teamName;
      // Redirect after save
      team.$save(function (response) {
        $location.path('teams');

        // Clear form fields
        $scope.teamName = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      var user = new Users($scope.authentication);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
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

    //populate team with users
    $scope.teamRoster = function(){
      $location.path('/teams');
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
     // console.log($scope.teams);
    };

    // Find existing Team
    $scope.findOne = function () {
      $scope.team = Teams.query({
        teamName: $stateParams.teamName
      });
      console.log($scope.team);
    };

    // Find existing Team
    $scope.findTeam = function () {
    // $scope.current;
    //  $scope.members;
     $scope.teams = Teams.query(function (response) {
       angular.forEach(response, function (item) {
         if (item.teamName === Authentication.user.team) {
           $scope.current = item;
            $scope.members = item.members;
           console.log($scope.members);

         }
       });
     });

    };
  }
]);

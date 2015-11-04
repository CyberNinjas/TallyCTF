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

    
      var team = new Teams({
        teamName: this.teamName,
        members: (Authentication.user.username)
      });

     // team.members.push(Authentication.user);
    Authentication.user.team= this.teamName;
      // Redirect after save

      team.$save(function (response) {
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

  //Redirect the createTeam to adding users
  $scope.teamRoster = function(){
    $location.path('/teams/addusers');
  };

  //Adds the users to the team
  $scope.add = function() {
        $scope.tasks.push($scope.user);
    };



  //Deletes users from the team SHOULD ONLY BE FOR ADMIN DO NOT ATTEMP THIS.
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

'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location','Teams','Authentication','Users', 'Teams1',
  function ($scope, $stateParams, $location, Teams, Authentication, Users, Teams1) {
    $scope.authentication = Authentication.user;
    $scope.users = Users;


    // Create new Team
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'teamForm');

        return false;
      }


      var team = new Teams({
        teamName: this.teamName,
        members: Authentication.user.username,
        teamCaptain: Authentication.user
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


    $scope.requestsToJoin = function(team){
      var lteam = new Teams(team);
      console.log("captain: ");


      console.log(lteam.teamCaptain.username);
      var user = new Users(team.teamCaptain);
      console.log(Authentication.user.username);
     // console.log(team.teamName);

     // team.$apply();

      var flag = true;
      var requests = lteam.requestToJoin;
      //check if user already asks to join
      var i;
      for(i=0;i<requests.length;i++){
        if(requests[i]===Authentication.user.username){
          flag = false;
          console.log('flag was set false');
        }
      }

      console.log(flag);
      if(flag) {
        console.log("user");
        console.log(user);
        user.notifications+=1;
        team.$update(function () {
          $location.path('teams/' + team._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
        user.$update(function (response) {
          $scope.$broadcast('show-errors-reset', 'userForm');

          $scope.success = true;
          user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      }
    };

    //Adds the users to the team
    $scope.add = function() {

          //pulls all the Users from the database
          var users = Users.query();
          console.log("*******");
          console.log(users);
          Teams1.update();
      };

    // Find a list of Teams
    $scope.find = function () {
      $scope.teams = Teams.query();
     // console.log($scope.teams);
    };

    $scope.findUsers = function(){
      $scope.users = Users.query();
    };

    // Find existing Team
    $scope.findOne = function () {
      $scope.team = Teams.query({
        teamName: $stateParams.teamName
      });
      console.log($scope.team);
    };

    $scope.shouldRender=function(role){
      var TC = false;
      var TM = false;
      var US= false;

      var mroles = Authentication.user.roles;
      for(var i=0;i<mroles.length;i++){
        if(mroles[i]==='teamCaptain'){
          TC=true;
        }
        if(mroles[i]==='teamMember'){
          TM = true;
        }
        if(mroles[i]==='user'){
          US = true;
        }
      }
      if(role ==='teamCaptain'){
        return TM&&TC&&US;
      }
      else if(role==='teamMember'){
        return TM&&US&&!TC;
      }
      else if(role==='user'){
        return !TM&&US&&!TC;
      }
      else
        return false;
    };
    // Find existing Team
    $scope.findTeam = function () {
     $scope.teams = Teams.query(function (response) {
       angular.forEach(response, function (item) {
         if (item.teamName === Authentication.user.team) {
           $scope.current = item;
            $scope.members = item.members;
           $scope.requests = item.requestToJoin;
           console.log($scope.members);

         }
       });
     });

    };

  }
]);

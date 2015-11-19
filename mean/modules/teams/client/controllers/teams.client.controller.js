'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location','Teams','Authentication','Users', 'Teams1','TeamsAccept','TeamsDecline',
  function ($scope, $stateParams, $location, Teams, Authentication, Users, Teams1,TeamsAccept, TeamsDecline) {
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
        members: Authentication.user._id,
        teamCaptain: Authentication.user._id
      });

     // team.members.push(Authentication.user);

      // Redirect after save
      team.$save(function (response) {

        Authentication.user.team = response._id;
        var user = new Users($scope.authentication);

        //user.team= team._id;

        user.$update(function (response) {
          $scope.$broadcast('show-errors-reset', 'userForm');

          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
        $scope.teamName = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
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

      console.log(JSON.stringify(team));



      var user = new Users(Authentication.user);

     // console.log(team.teamName);

     // team.$apply();

      var flag = true;
      var requests = team.requestToJoin;
      //check if user already asks to join
      var i;
      for(i=0;i<requests.length;i++){
        if(requests[i]._id===Authentication.user._id){
          flag = false;

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
      var team = new Teams(Authentication.user.team);
      var user = $scope.search.username;

      console.log(Authentication.user.team);
      console.log(user);

      Teams1.update();
    };

    $scope.accept = function(name) {

      console.log("clicked accept");
      TeamsAccept.update();
    };
    $scope.decline = function(name) {


      TeamsDecline.update();
    };
    // Find a list of Teams
    $scope.find = function () {
      $scope.teams = Teams.query();
     // console.log($scope.teams);
    };

    $scope.findUsers = function(){
       $scope.users = Users.query("username");
    };


    // Find existing Team
    $scope.findOne = function () {
      $scope.team = Teams.query({
        teamName: $stateParams.teamName
      });

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

        return (TM&&TC&&US);
      }
      else if(role==='teamMember'){

        return (TM&&US&&!TC);
      }
      else if(role==='user'){

        return (!TM&&US&&!TC);
      }
      else
        return false;
    };


    // Find existing Team
    $scope.findTeam = function () {
     $scope.mteam = Teams.get({teamId: Authentication.user.team});



    };

  }
]);

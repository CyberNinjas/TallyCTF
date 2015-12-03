'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope','$stateParams', '$location', '$state', 'Teams','Authentication','Users','TeamsCtl',
  function ($scope, $stateParams, $location, $state, Teams, Authentication, Users, TeamsCtl) {
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

      // Redirect after save
      team.$save(function (response) {

        Authentication.user.team = response._id;
        var user = new Users($scope.authentication);

        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
          $state.go('teams.add');
        }, function (response) {
          $scope.error = response.data.message;
        });

        $scope.teamName = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Deletes users from the team SHOULD ONLY BE FOR ADMIN DO NOT ATTEMP THIS.
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

    // User requests to join a team
    $scope.requestsToJoin = function (team) {
      team.temp = Authentication.user._id;
      TeamsCtl.requestToJoin(team);
      // // FIXME: Bad taste. Find a better way of getting access to the
      // // FIXME: user's methods besides creating a new one.
      // var user = new Users(Authentication.user);

      // var flag = true;
      // var requests = team.requestToJoin;

      // console.log(flag);
      // if(flag) {
      //   team.teamCaptain.notifications+=1;
      //   team.requestToJoin.push(user);
      //   user.requestToJoin.push(team._id);

      //   team.$update(function () {
      //     $location.path('teams/' + team._id);
      //   }, function (errorResponse) {
      //     $scope.error = errorResponse.data.message;
      //   });
      //   user.$update(function (response) {
      //     console.log(response);
      //     Authentication.user = response;
      //   }, function (response) {
      //     $scope.error = response.data.message;
      //   });
      // }
    };

    //Adds the users to the team
    $scope.addUser = function (user) {
      var teamID = $scope.mteam._id;

      // WARNING: Some sort of (effective) validation should be made
      $scope.mteam.temp = user._id;
      TeamsCtl.askToJoin($scope.mteam);
    };

    // Remove a user from the team when editing the team
    $scope.removeMember = function (user, index) {
      $scope.team.members.splice(index, 1);
      $scope.team.temp = user._id;
      console.log($scope.team);
      TeamsCtl.remove($scope.team);
    };


    $scope.accept = function(user, index) {
      var add = $scope.mteam.requestToJoin.splice(index, 1);
      console.log(add);
      $scope.mteam.members.push(add[0]);
      $scope.mteam.temp = user._id;
      TeamsCtl.accept($scope.mteam);
    };


    $scope.decline = function(user, index) {
      $scope.mteam.temp = user._id;
      TeamsCtl.decline($scope.mteam);
      $scope.mteam.requestToJoin.splice(index, 1);
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

    // Find existing Team
    $scope.findTeam = function () {
      if(Authentication.user.team){
        $scope.mteam = Teams.get({
          teamId: Authentication.user.team
        });
      } else{
        var teams = Teams.findRequests(function () {
          console.log(teams);
          var len = teams.pop();

          console.log(teams);
          console.log(len);

          $scope.askTeams = [];

          while (len--)
            $scope.askTeams.push(teams.pop());

          $scope.requestTeams = teams;

        });
      }
    };

    $scope.findTeamName = function(id){

     // return $scope.requestTeam.teamName;

    };
    // Finds available users to add
    $scope.findAvailableUsers = function(){
       $scope.users = Users.listAvailableUsers();
       $scope.mteam = Teams.getRaw({teamId: Authentication.user.team});

       // For UI, have a count of how many users are available to choose from
       $scope.count = 0;
    };

    //teamMember and teamCaptain are mutually exclusive
    $scope.shouldRender = function (role, usr) {
      var user = (usr ? usr : Authentication.user);

      if (role === 'user') {
        return (user && 
          (user.roles.indexOf('teamCaptain') === -1 ) &&
          (user.roles.indexOf('teamMember') === -1));
      }

      return (user && user.roles.indexOf(role) !== -1);
    };

    // Checks which users should show up on the add users page
    $scope.shouldAdd = function (usr) {
      var user = (usr ? usr : Authentication.user);

      // Make sure that there is a user to check for / a team to check from!
      if (!user || !$scope.mteam.$resolved)
        return false;

      var inReq = ($scope.mteam.requestToJoin.indexOf(user._id) !== -1);
      var inAsk = ($scope.mteam.askToJoin.indexOf(user._id) !== -1);

      if (inReq || inAsk) 
        return false;

      // Increment the count of how many available users there are
      $scope.count += 1;
      return true;
    };

    // Checks which users should show up on the add users page
    $scope.shouldReq = function (team) {
      var user = Authentication.user;

      // Make sure that there is a user to check for / a team to check from!
      if (!user || !team)
        return false;

      var inReq = (team.requestToJoin.indexOf(user._id) !== -1);
      var inAsk = (team.askToJoin.indexOf(user._id) !== -1);

      if (inReq || inAsk) 
        return false;

      // Increment the count of how many available users there are
      $scope.count += 1;
      return true;
    };
  }
]);

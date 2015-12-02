'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope','$stateParams', '$location', '$state', 'Teams','Authentication','Users', 'Teams1','TeamsCtl', 'Utils',
  function ($scope, $stateParams, $location, $state, Teams, Authentication, Users, Teams1, TeamsCtl, Utils) {
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


    $scope.requestsToJoin = function(team){
      // FIXME: Bad taste. Find a better way of getting access to the
      // FIXME: user's methods besides creating a new one.
      var user = new Users(Authentication.user);

      var flag = true;
      var requests = team.requestToJoin;
      //check if user already asks to join
      for(var i = 0; i < requests.length; ++i){
        if(requests[i]._id === user._id) {
          flag = false;
        }
      }

      console.log(flag);
      if(flag) {
        console.log("user");
        console.log(user);
        //user.notifications+=1;
        team.teamCaptain.notifications+=1;
        team.requestToJoin.push(user);
        user.requestToJoin.push(team._id);

        team.$update(function () {
          $location.path('teams/' + team._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
        user.$update(function (response) {
          console.log(response);
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      }
    };

    //Adds the users to the team
    $scope.addUser = function (user) {
      var teamID = $scope.mteam._id;

      // Find the user and add it
      for (var i = 0; i < $scope.users.length; i++) {
        if (user.username === $scope.users[i].username) {
          $scope.mteam.temp = $scope.users[i]._id;
          break;
        }

        // Double check that the requested user was found
        if (i === $scope.users.length - 1)
        {
          $scope.error = "That user does not exist!";
          return 1;
        }
      }

      Teams1.update($scope.mteam);
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
      $scope.mteam = Teams.get({
        teamId: Authentication.user.team
      });
    };

    // FIXME: This only works if the user is an admin. Need to either come up /
    // FIXME: with a new route for querying for only usernames or add policy /
    // FIXME: rules to the users module
    $scope.findUsers = function(){
       $scope.users = Utils.listUsers();
       $scope.mteam = Teams.get({teamId: Authentication.user.team});
    };
    
    // FIXME: This should be added to the policies for the team module /
    // FIXME: as it deals explicitly with permissions

    //teamMember and teamCaptain are mutually exclusive
    $scope.shouldRender = function (role) {
      if (role === 'user') {
        return (Authentication.user && 
          (Authentication.user.roles.indexOf('teamCaptain') === -1 ) &&
          (Authentication.user.roles.indexOf('teamMember') === -1));
      }

      return (Authentication.user && Authentication.user.roles.indexOf(role) !== -1);
    };
  }
]);

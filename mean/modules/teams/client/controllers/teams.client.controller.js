'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', 'Users', '$location', 'Authentication', 'Teams',
  function ($scope, $stateParams,Users, $location, Authentication, Teams) {
    $scope.authentication = Authentication;

  $scope.team = ["Learn node"];


  // Returns true IFF the keycode is equal to specified keycode
    $scope.validateKey = function (event, keycode) {
      var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0
      return key === keycode;
    };

    //adds users to the team array
    //need to figure out how to push that to the database.
    $scope.addUsers = function(event){
      if (event && !$scope.validateKey(event, 13)){
        return;
      }
      $scope.team.push($scope.teammates);
      $scope.teammates = "";
    };


    // Create new Team
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'teamForm');

        return false;
      }
      var team = new Teams({
        teamName: this.teamName
      });

      // Redirect after save
      team.$save(function (response) {
        $location.path('teams/addusers');


        // Clear form fields
        $scope.teamName = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
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
    };

    // Find existing Team
    $scope.findOne = function () {
      $scope.team = Teams.get({
        teamId: $stateParams.teamId
      });
    };
  }
]);

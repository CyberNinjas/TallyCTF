'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Teams',
  function ($scope, $stateParams, $location, Authentication, Teams) {
    $scope.authentication = Authentication;

  $scope.todos = ["Learn Angular", "Learn node"];
  $scope.newItem = "";
  $scope.visible = true;
  $scope.inEditMode = false;
  $scope.editItem = "";
  $scope.priority = 2;
  priorityArr = ["High","Medium","Low"];

  // Returns true IFF the keycode is equal to specified keycode
  $scope.validateKey = function (event, keycode) {
    var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0
    return key === keycode;
  }

  $scope.addItem = function(event){
    if (event && !$scope.validateKey(event, 13))
      return;
    console.log("in add");
	console.log($scope.todos.indexOf($scope.newItem));
    if ($scope.newItem !== "" && $scope.todos.indexOf(priorityArr[$scope.priority] + " Priority:  " + $scope.newItem) === -1){
      if($scope.priority == 0){
        $scope.todos.push(priorityArr[$scope.priority] + " Priority:  "  + $scope.newItem);

       $scope.newItem = "";
       $scope.priority = 2;
      }
      else if($scope.priority == 1){
        $scope.todos.push(priorityArr[$scope.priority] + " Priority:  "  + $scope.newItem);
        $scope.newItem = "";
        $scope.priority = 2;
      }
      else if($scope.priority == 2){
         $scope.todos.push(priorityArr[$scope.priority] + " Priority:  " + $scope.newItem);

        $scope.newItem = "";
        $scope.priority = 2;
      }
      else{
        alert("Enter something, damn it");
      }
    }
  }



    $scope.addItem = function(event){
      if (event && !$scope.validateKey(event, 13)){
        return;
      }
      $scope.users.push($scope.user);
    };
















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

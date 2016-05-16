'use strict'
/**
 * @ngdoc controller
 * @name AddUsersTeamsController
 * @description
 * This controller is for letting captains search through available users
 * and select to add any one of them to their current team
 */
angular.module('teams')
  .controller('AddUsersTeamsController', ['$scope', '$stateParams', '$controller', 'Teams', 'Users', 'TeamsCtl',
    function ($scope, $stateParams, $controller, Teams, Users, TeamsCtl) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      $scope.team = Teams.get({
        teamId: $stateParams.teamId
      });

      /**
       * @ngdoc function
       * @name findAvailableUsers
       * @description
       * Queries the database looking for available users
       *
       */
      $scope.findAvailableUsers = function () {
        $scope.users = Users.listAvailableUsers({
          teamId: $stateParams.teamId
        });
      };

      /**
       * @ngdoc function
       * @name addUser
       * @description
       * Removes the selected user from the list of available users and
       * sends them an ivitation to join the operating captains team
       */
      $scope.addUser = function (user) {
        var teamID = $scope.team._id;
        $scope.team.temp = user._id;
        for(var i = 0; i < $scope.users.length; ++i) {
          if($scope.users[i]._id.toString() === user._id.toString()) {
            $scope.users.splice(i, 1);
            $scope.count--;
            break;
          }
        }
        TeamsCtl.askToJoin($scope.team);
      };
    }
  ])

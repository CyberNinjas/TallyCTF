'use strict'
/**
 * @ngdoc controller
 * @name AddUsersTeamsController
 * @description
 * This controller is for letting captains search through available users
 * and select to add any one of them to their current team
 */
angular.module('teams')
  .controller('AddUsersTeamsController', ['$scope', '$stateParams',
    '$controller', 'Teams', 'Users', 'TeamsCtl',
    function ($scope, $stateParams, $controller, Teams, Users, TeamsCtl) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      /**
       * @ngdoc function
       * @name findAvailableUsers
       * @description
       * Queries the database looking for available users
       *
       */
      $scope.findAvailableUsers = function () {
        $scope.users = [];
        $scope.team = Teams.get({
          teamId: $stateParams.teamId
        });
        $scope.team.$promise.then(function (data) {
          var users = Users.query();
          users.$promise.then(function (data) {
            angular.forEach(users, function (user) {
              if (user._id !== $scope.team.teamCaptain._id &&
                user.roles.indexOf('admin') < 0 && user.team.indexOf(
                  $scope.team._id) < 0) {
                $scope.users.push(user);
              }
            })
          })
        })
      }

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
        for (var i = 0; i < $scope.users.length; ++i) {
          if ($scope.users[i]._id.toString() === user._id.toString()) {
            $scope.users.splice(i, 1);
            $scope.count--;
            break;
          }
        }
        TeamsCtl.askToJoin($scope.team);
        ToJoin($scope.team);
      };
    }
  ])

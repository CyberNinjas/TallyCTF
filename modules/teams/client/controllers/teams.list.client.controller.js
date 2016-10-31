'use strict'

angular.module('teams')
  .controller('TeamsListController', ['$scope', '$controller', 'Teams',
    'Users',
    function ($scope, $controller, Teams, Users) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });

      $scope.shouldRender = function () {
        return ($scope.authentication.type.indexOf('admin') === -1)
      }

      $scope.canRequest = function (team) {
        var user = $scope.authentication._id;
        var allowedToRequest = false;
        if (user && team) {
          var askedToJoin = (team.joinRequestsFromUsers.indexOf(user) !==
            -1);
          var wasAskedToJoin = (team.joinRequestsToUsers.indexOf(user) !==
            -1);
          var isMember = (team.members.indexOf(user) !== -1);
          if (!(askedToJoin || wasAskedToJoin || isMember)) {
            allowedToRequest = true;
          }
        }
        return allowedToRequest
      };

      $scope.askToJoin = function (team) {
        var user = $scope.authentication;
        team.joinRequestsFromUsers.push(user._id)

        Teams.update(team, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        user.requestToJoin.push(team._id)
        Users.update(user, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        var msg = {
          team: team._id,
          username: user.username,
          _id: user._id
        };
        $scope.socket.emit('insertRequest', msg);
      };
    }
  ]);

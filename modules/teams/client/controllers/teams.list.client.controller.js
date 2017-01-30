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

      /**
       * A user is only able to request to join a team if they're not currently in the
       * list of users that's asked to join, they're not in the list of users that has
       * asked to join, and they're not currently a member of the team.
       *
       * @param team - the team that were checking is available to be requested
       * @returns {boolean} - yes the user can request membership or no
       */
      $scope.canRequest = function (team) {
        var user = $scope.authentication._id;
        var allowedToRequest = false;
        if (user && team) {
          var askedToJoin = (team.joinRequestsFromUsers.indexOf(user) !== -1);
          var wasAskedToJoin = (team.joinRequestsToUsers.indexOf(user) !== -1);
          var isMember = (team.members.indexOf(user) !== -1);
          if (!(askedToJoin || wasAskedToJoin || isMember)) {
            allowedToRequest = true;
          }
        }
        return allowedToRequest
      };

      /**
       * Adds the user to the team's requests from users object and adds
       * the team to the user's made requests.
       *
       * Then sends a socket emit to notify users
       *
       * @param team - the team that the user is attempting to join
       */
      $scope.askToJoin = function (team) {
        var user = $scope.authentication;
        team.joinRequestsFromUsers.push(user._id)
        Teams.update(team, function () {
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });

        user.requestedToJoin.push(team._id)
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

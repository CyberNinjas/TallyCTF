'use strict'

/**
 * @ngdoc controller
 * @name teams.controller:TeamsListController
 * @description
 * This controller handles listing existing teams and
 * giving users the ability to join a listed team
 */

angular.module('teams')
  .controller('TeamsListController', ['$scope', '$controller', 'Teams', 'Users', 'TeamsCtl',
    function ($scope, $controller, Teams, Users, TeamsCtl) {

      $controller('BaseTeamsController', {
        $scope: $scope
      });
      console.log($scope);

      $scope.shouldRender = function () {
        return($scope.authentication.type.indexOf('admin') === -1)
      }

      $scope.canRequest = function (team) {
        var user = $scope.authentication;
        var allowRequest = false;
        if($scope.authentication && team) {
          var inReq = (team.requestToJoin.indexOf(user._id) !== -1);
          var inAsk = (team.askToJoin.indexOf(user._id) !== -1);
          var isMember = (team.members.indexOf(user._id) !== -1);
          if(!(inReq || inAsk || isMember)) {
            allowRequest = true;
            $scope.count += 1;
          }
        }
        return allowRequest
      };

      $scope.requestToJoin = function (team) {
        var msg = {
          username: $scope.authentication.username,
          _id: $scope.authentication._id
        };
        $scope.socket.emit('insertRequest', msg);
        team.temp = $scope.authentication._id;
        TeamsCtl.requestToJoin(team);
      };
    }
  ]);

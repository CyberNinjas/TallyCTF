'use strict';

angular.module('ctfEvents').controller('DashboardController', ['$scope', '$filter','$stateParams', '$location', 'Authentication',
  'CtfEvents', 'Challenges', 'Teams', 'Users', function ($scope, $filter, $stateParams, $location, Authentication,
                                                         CtfEvents, Challenges, Teams, Users) {


    // Each query is nested in the previous one's promise to make sure
    // everything resolves before we set each of the select's options
    $scope.ctfEvent = CtfEvents.get({ ctfEventId: $stateParams.ctfEventId })
    $scope.ctfEvent.$promise.then(function(data) {
      $scope.challenges = Challenges.query();
      $scope.challenges.$promise.then(function(data) {
        $scope.teams = Teams.query();
        $scope.teams.$promise.then(function(data) {
          $scope.eventTeams = $filter('selected')($scope.teams, $scope.ctfEvent.teams);
          $scope.eventChallenges = $filter('selected')($scope.challenges, $scope.ctfEvent.challenges);
        });
      });
    });

    $scope.remainingTime = '00:00:00'
    $scope.tile_stats = {
      points: { title: 'Number Of Points Available:',
                value: 5309,
                change: null,
                icon: 'fa fa-star'

      },
      position: { title: 'Your Team\'s Position',
        value: '5th',
        change: -1,
        icon: 'fa fa-sort-numeric-asc'

      },
      total: { title: 'Your Team\'s Total Points',
               value: 339,
               change: 3,
               icon: 'fa fa-bullseye'
      }
    };
  }]).filter('unselected', function() {
    return function(list, obj) {
      return list.filter(function(item) {
        if (obj.indexOf(item._id)< 0) {
          return true;
        }
      });
    };
  }).filter('selected', function() {
    return function(list, obj) {
      return list.filter(function(item) {
        if (obj.indexOf(item._id)>= 0) {
          return true;
        }
      });
    };
  });

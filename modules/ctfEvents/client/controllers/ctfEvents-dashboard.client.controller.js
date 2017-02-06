'use strict';
angular.module('ctfEvents').controller('DashboardController', ['$scope', '$controller', '$state', '$filter', '$stateParams', '$location', '$q', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', 'Cache', 'CacheFactory',
  function ($scope, $controller, $state, $filter, $stateParams, $location, $q, Authentication, CtfEvents, Challenges, Teams, Users, Cache, CacheFactory) {

    $controller('BaseEventsController', {
      $scope: $scope
    });

    $scope.easy = 10;
    $scope.medium = 100;
    $scope.hard = 1000;
    $scope.sortType = '';
    $scope.challengeSearch = '';
    $scope.showUnavailable = '';

    $scope.howHard = function (challenge) {
      if (challenge.teamSubmissions >= challenge.numberOfSubmissions) {
        challenge.unavailable = true
        return 'list-group-item disabled'
      }
      if (challenge.points <= $scope.easy) {
        return 'list-group-item list-group-item-success'
      } else if (challenge.points <= $scope.medium) {
        return 'list-group-item list-group-item-warning'
      } else if (challenge.points <= $scope.hard) {
        return 'list-group-item list-group-item-danger'
      } else {
        return 'list-group-item list-group-item-primary'
      }
    }

    $controller('BaseEventsController', {
      $scope: $scope
    });

    var event = false;
    var eventCache = CacheFactory.get('eventCache');
    $scope.ctfEvent = eventCache.get('api/ctfEvents/' + $stateParams.ctfEventId)
    if (!$scope.ctfEvent) {
      event = CtfEvents.get({ ctfEventId: $stateParams.ctfEventId }).$promise
      event.then(function (data) {
        $scope.ctfEvent = data;
        angular.forEach($scope.ctfEvent.teams, function (team) {
          if (team.members.indexOf(Authentication.user._id) > -1) {
            $scope.currentTeam = team;
          }
        })
        $scope.ctfEvent.challenges.map(function (challenge) {
          challenge.teamSubmissions = $filter('submissionFilter')(challenge.submissions, $scope.currentTeam).length;
        })
      })
    } else {
      $scope.ctfEvent = JSON.parse($scope.ctfEvent[1]);
    }

    $scope.all.then(function () {
      $scope.challenges.map(function (challenge) {
        challenge.isCollapsed = true
        return challenge
      })
    }).then(function () {
      $scope.eventId = $stateParams.ctfEventId
      $scope.eventTeams = $filter('memberTeams')($scope.teams, $scope.ctfEvent.teams);
      $scope.ongoing = $scope.isOngoing()
      $scope.getRemainingTime()
      $scope.remainingTime = $scope.ongoing === false ? '00:00:00' : $scope.hours + ':' + $scope.minutes

      $scope.tile_stats = [{
        title: 'Your Position',
        value: $scope.ongoing === false ? 'N/A' : '1st',
        change: $scope.ongoing === false ? null : 0,
        icon: 'fa fa-sort-numeric-asc'
      }, {
        title: 'Points Available:',
        value: $scope.ongoing === false ? 0 : $scope.getPointTotal(),
        change: null,
        icon: 'fa fa-diamond'
      }, {
        title: 'Your Point Total ',
        value: $scope.ongoing === false ? 0 : 0,
        change: $scope.ongoing === false ? null : 0,
        icon: 'fa fa-bullseye'
      }, {
        title: 'Points Behind 1st',
        value: $scope.ongoing === false ? 0 : 0,
        change: $scope.ongoing === false ? null : 0,
        icon: 'fa fa-thumbs-o-down'
      }]
    });

    $scope.getPointTotal = function () {
      var pointTotal = $scope.ctfEvent.challenges.reduce(function (total, challenge) {
        return total + challenge.points;
      }, 0);
      return pointTotal
    }

    $scope.isOngoing = function () {
      var hasStarted = $scope.ctfEvent.start < moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') && moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') < $scope.ctfEvent.end
      return hasStarted
    }

    $scope.getRemainingTime = function () {
      var duration = moment.duration(moment($scope.ctfEvent.end).diff(moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')))
      var milliseconds = duration._milliseconds;
      milliseconds = Math.floor(milliseconds / 1000);
      $scope.seconds = (milliseconds % 60);
      milliseconds = Math.floor(milliseconds / 60);
      $scope.minutes = (milliseconds % 60);
      milliseconds = Math.floor(milliseconds / 60);
      $scope.hours = milliseconds;
    }

    $scope.getUserName = function (id) {
      return $filter('filter')($scope.users, { _id: id })[0].displayName;
    }

    $scope.goToChallenge = function (unavailable, eventId, id) {
      if (!unavailable) {
        $state.go(ctfEvents.submission, { 'ctfEventId': eventId, 'challengeId': id })
      }
    }

    $scope.getTeam = function (team) {
      return $filter('filter')($scope.teams, { _id: team.id })[0];
    }
  }])


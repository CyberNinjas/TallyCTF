'use strict';
angular.module('ctfEvents').controller('DashboardController', ['$scope', '$controller', '$state', '$filter', '$stateParams', '$location', '$q', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', 'Cache', 'CacheFactory',
  function ($scope, $controller, $state, $filter, $stateParams, $location, $q, Authentication, CtfEvents, Challenges, Teams, Users, Cache, CacheFactory) {

    $controller('BaseEventsController', {
      $scope: $scope
    });

    $scope.isAdmin = function () {
      return $scope.authentication.roles.indexOf('admin') > -1
    }

    $scope.export = function (nice) {
      CtfEvents.export({ id: $scope.id }).$promise.then(function (data) {
        var event = data;
        if(nice){
          event = {}
          angular.forEach($scope.ctfEvent.challenges, function (challenge) {
            if(challenge.scorers.length > 0){
              angular.forEach(challenge.niceCategories, function (category) {
                event[category] = challenge.scorers
              })
            }
          })
        }
        var url = URL.createObjectURL(new Blob([JSON.stringify(event, null, 2)]));
        var a = document.createElement('a');
        a.href = url;
        var filePath = nice ? '.nice.' : '.'
        a.download = $scope.ctfEvent.title + filePath + 'json';
        a.target = '_blank';
        a.click();
      })
    }

    $scope.easy = 10;
    $scope.medium = 100;
    $scope.hard = 1000;
    $scope.sortType = '';
    $scope.challengeSearch = '';
    $scope.showUnavailable = '';

    $scope.howHard = function (challenge) {
      if (!$scope.currentTeam) {
        return
      }
      if (challenge.teamSubmissions >= challenge.numberOfSubmissions || challenge.scorers.indexOf($scope.currentTeam._id) > -1) {
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


    $scope.all.then(function () {
      angular.forEach($scope.ctfEvent.teams, function (team) {
        if (team.members.indexOf(Authentication.user._id) > -1) {
          $scope.currentTeam = team;
        }
      })
      $scope.ctfEvent.challenges.map(function (challenge) {
        challenge.teamSubmissions = $filter('submissionFilter')(challenge.submissions, $scope.currentTeam).length;
      })
      $scope.challenges.map(function (challenge) {
        challenge.isCollapsed = true
        return challenge
      })
    }).then(function () {
      $scope.eventId = $stateParams.ctfEventId
      $scope.eventTeams = $filter('memberTeams')($scope.teams, $scope.ctfEvent.teams);
      console.log($scope.eventTeams)
      $scope.ongoing = $scope.isOngoing()
      $scope.getRemainingTime()
      $scope.remainingTime = $scope.ongoing === false ? '00:00:00' : $scope.hours + ':' + $scope.minutes
      $scope.teamsPoints = $scope.getTeamsPoints()
      $scope.tile_stats = [{
        title: 'Your Position',
        value: $scope.ongoing === false ? 'N/A' : '1st',
        change: $scope.ongoing === false ? null : 0,
        icon: 'fa fa-sort-numeric-asc'
      }, {
        title: 'Points Available:',
        value: $scope.ongoing === false ? 0 : ($scope.getPointTotal() - $scope.teamsPoints),
        change: null,
        icon: 'fa fa-diamond'
      }, {
        title: 'Your Point Total ',
        value: $scope.ongoing === false ? 0 : $scope.teamsPoints,
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
      var onTeam = false;
      angular.forEach($scope.ctfEvent.teams, function (team) {
        if (team.members.indexOf(Authentication.user._id) > -1) {
          onTeam = true;
        }
      })
      return (hasStarted && onTeam)
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

    $scope.getTeamsPoints = function () {
      var score = 0;
      angular.forEach($scope.ctfEvent.teams, function (team) {
        if (team.members.indexOf($scope.userId) > -1) {
          angular.forEach($scope.ctfEvent.score, function (scorer) {
            if (scorer.team === team.team) {
              score = scorer.score
            }
          })
        }
      })
      return score;
    }
    $scope.getScore = function (id) {
      var score = 0;
      angular.forEach($scope.ctfEvent.score, function (scorer) {
        if (scorer.team === id) {
          score = scorer.score
        }
      })
      return score;
    }
  }])


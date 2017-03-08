'use strict';
angular.module('ctfEvents').controller('DashboardController', ['$scope', '$controller', '$state', '$filter', '$stateParams', '$location', '$q', 'Authentication', 'CtfEvents', 'Challenges', 'Teams', 'Users', 'Cache', 'CacheFactory',
  function ($scope, $controller, $state, $filter, $stateParams, $location, $q, Authentication, CtfEvents, Challenges, Teams, Users, Cache, CacheFactory) {

    $controller('BaseEventsController', {
      $scope: $scope
    });

    /*
     * Determines whether or not 'admin' exists within the users roles
     */
    $scope.isAdmin = function () {
      return $scope.authentication.roles.indexOf('admin') > -1
    }

    /*
     * gathers the unedited database object of the current event. If the users selects the nice option then
     * we do some manipulation to output a list of scorers per relevant category.
     *
     * We then create a temporary url for the data to be downloaded, dynamically create a filename, and
     * initiate the download for the user
     */
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

    /*
     *  Defines both the color of the list-group-item for each of the displayed challenges and whether or not it's actively
     *  allowed to be clicked ( too many submission or already correct )
     */
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

    /*
     * Grab the total number of points available in the event by iterating through each challenge and keeping
     * a sum of their values
     */
    $scope.getPointTotal = function () {
      var pointTotal = $scope.ctfEvent.challenges.reduce(function (total, challenge) {
        return total + challenge.points;
      }, 0);
      return pointTotal
    }

    /*
     * Determines whether a user has access to view the current events questions based on determining whether the current user
     * is actually a member of a team that's registered for the event and wheter the current time is between the event's start and
     * end
     */
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

    /*
     * Get a human readable version of the remaining time to display on the dashboard
     */
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

    /*
     * users in the team object are stored as IDs and we want their names
     */
    $scope.getUserName = function (id) {
      return $filter('filter')($scope.users, { _id: id })[0].displayName;
    }

    /*
     * If the challenge is available for the current user then we move to the submission view
     */
    $scope.goToChallenge = function (unavailable, eventId, id) {
      if (!unavailable) {
        $state.go(ctfEvents.submission, { 'ctfEventId': eventId, 'challengeId': id })
      }
    }

    /*
     * filters the teams object to get the current team object
     */
    $scope.getTeam = function (team) {
      return $filter('filter')($scope.teams, { _id: team.id })[0];
    }

    /*
     * filters the score object to get the current teams overall score
     */
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


angular.module('ctfEvents').service('usersTeamsService', function () {
  var teamsList = [{
    teamName: 'None'
  }];
  var addTeam = function (newObj) {
    teamsList.push(newObj);
  };
  var getTeams = function () {
    return teamsList;
  };
  var resetTeams = function () {
    teamsList = [{
      teamName: 'None'
    }];
  };
  return {
    addTeam: addTeam,
    getTeams: getTeams,
    resetTeams: resetTeams
  };
});

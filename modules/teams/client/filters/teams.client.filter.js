angular.module('teams').filter('members', function() {
  return function(collection, team) {
    var members = [];
    if(team) {
      collection.forEach(function (user) {
        if (team.members && team.members.indexOf(user._id) !== -1) {
          members.push(user);
        }
      })
    }
    return members;
  };
}).filter('availableUsers', function() {
  return function(collection, team) {
    var members = [];
    collection.forEach(function(user) {
      if (user.roles.indexOf('admin') < 0 && user.wasAskedToJoin.indexOf(team._id) < 0 && team.members.indexOf(user._id) < 0 && team.joinRequestsToUsers.indexOf(user._id) < 0 && team.joinRequestsFromUsers.indexOf(user._id) < 0 && team.teamCaptain !== user._id){
        members.push(user);
      }
    })
    return members;
  };
}).filter('requests', function() {
  return function(collection, team) {
    var requests = [];
    collection.forEach(function(user) {
      if (team.joinRequestsToUsers.indexOf(user._id) !== -1){
        requests.push(user)
      }
    })
    return requests
  }
}).filter('asks', function() {
  return function(collection, team) {
    var asks = [];
    collection.forEach(function(user) {
      if (team.joinRequestsFromUsers.indexOf(user._id) !== -1){
        asks.push(user)
      }
    });
    return asks
  };
}) .filter('dashboardRequests', function() {
  return function(collection, user) {
    var requests = [];
    collection.forEach(function(team) {
      if(team.joinRequestsToUsers.indexOf(user._id) > -1){
        requests.push(team)
      }
    })
    return requests
  }
}).filter('dashboardAsks', function() {
  return function(collection, user) {
    var asks = [];
    collection.forEach(function(team) {
      if(team.joinRequestsFromUsers.indexOf(user._id) > -1){
        asks.push(team)
      }
    });
    return asks
  };
}).filter('myTeams', function() {
  return function(collection, user) {
    var teams = [];
    collection.forEach(function(team) {
      if (team.members.indexOf(user._id) !== -1){
        teams.push(team)
      }
    });
    return teams
  };
})

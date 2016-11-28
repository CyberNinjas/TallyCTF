angular.module('ctfEvents').filter('unselected', function() {
  return function(list, obj) {
    return list.filter(function(item) {
      if (obj.indexOf(item._id)< 0) {
        return true;
      }
    });
  };
}).filter('memberTeams', function() {
  return function(list, obj) {
    return list.filter(function(item) {
      for(var y = 0;y<obj.length;y++){
        if (obj[y]._id === item._id) {
          return true;
        }
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
}).filter('unselectedTeam', function() {
  return function(list, obj) {
    return list.filter(function(item) {
      var seen = false
      for(var x = 0;x<obj.length;x++){
        if ((obj[x].teamId) === (item._id)) {
          seen = true
        }
      };
      if(!seen){
        return true;
      }
    })
  };
}).filter('selectedTeam', function() {
  return function(list, obj) {
    return list.filter(function(item) {
      for(var y = 0;y<obj.length;y++){
        if (obj[y].teamId === item._id) {
          return true;
        }
      }
    });
  };
}).filter('captainsTeams', function() {
  return function(list, obj) {
    return list.filter(function(item) {
      for(var y = 0;y<obj.length;y++){
        if (obj[y] === item._id) {
          return true;
        }
      }
    });
  };
});

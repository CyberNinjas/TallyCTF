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
        if (obj[y].team === item._id) {
          return true;
        }
      }
    });
  };
}).filter('userTeams', function() {
  return function(list, obj) {
    return list.filter(function(item) {
      if (item.members.indexOf(obj._id) > -1) {
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
}).filter('unselectedObject', function() {
  return function(list, obj) {
    return list.filter(function(item) {
      var seen = false
      for(var x = 0;x<obj.length;x++){
        if ((obj[x]._id) === (item._id)) {
          seen = true
        }
      };
      if(!seen){
        return true;
      }
    })
  };
}).filter('selectedObject', function() {
  return function(list, obj) {
    return list.filter(function(item) {
      for(var y = 0;y<obj.length;y++){
        if (obj[y]._id === item._id) {
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

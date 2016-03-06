angular.module('ctfEvents').filter('unselected', function() {
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
}).filter('unselectedTeam', function() {
  return function(list, obj) {
    return list.filter(function(item) {
      var seen = false
      for(var x = 0;x<obj.length;x++){
        if (Object.keys(obj[x]).indexOf(item._id)>=0) {
          seen = true
        }
      }
      if(!seen){
        return true;
      }
    });
  };
}).filter('selectedTeam', function() {
  return function(list, obj) {
    return list.filter(function(item) {
      for(var y = 0;y<obj.length;y++){
        if (Object.keys(obj[y]).indexOf(item._id)>= 0) {
          return true;
        }
      }
    });
  };
});

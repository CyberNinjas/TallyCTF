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
});
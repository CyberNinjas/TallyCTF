'use strict';

angular.module('ctfEvents').filter('unselected', function () {
  return function (list, obj) {
    return list.filter(function (item) {
      if (obj && list && obj.indexOf(item._id) < 0) {
        return true;
      }
    });
  };
}).filter('selected', function () {
  return function (list, obj) {
    return list.filter(function (item) {
      if (obj && list && obj.indexOf(item._id) >= 0) {
        return true;
      }
    });
  };
}).filter('unselectedChallenge', function () {
  return function (list, obj) {
    return list.filter(function (item) {
      if (obj && list) {
        var seen = false
        for (var x = 0; x < obj.length; x++) {
          if ((obj[x].name) === (item.name)) {
            seen = true
          }
        }
        if (!seen) {
          return true;
        }
      }
    })
  };
}).filter('selectedChallenge', function () {
  return function (list, obj) {
    return list.filter(function (item) {
      if (obj && list) {
        for (var y = 0; y < obj.length; y++) {
          if (obj[y].name === item.name) {
            return true;
          }
        }
      }
    });
  };
})

angular.module('ctfEvents').filter('memberTeams', function () {
  return function (list, obj) {
    return list.filter(function (item) {
      for (var y = 0; y < obj.length; y++) {
        if (obj[y].team === item._id) {
          return true;
        }
      }
    });
  };
}).filter('userTeams', function () {
  return function (list, obj) {
    return list.filter(function (item) {
      if (item.members.indexOf(obj._id) > -1) {
        return true;
      }
    });
  };
}).filter('captainsTeams', function () {
  return function (list, obj) {
    return list.filter(function (item) {
      for (var y = 0; y < obj.length; y++) {
        if (obj[y] === item._id) {
          return true;
        }
      }
    });
  };
}).filter('difficultyFilter', function () {
  return function (list, difficulty) {
    if (!difficulty) {
      return list;
    }
    if (difficulty === 'easy') {
      return list.filter(function (element, index, array) {
        if (element.points > 0) {
          return element.points <= 10
        }
      })
    } else if (difficulty === 'medium') {
      return list.filter(function (element, index, array) {
        if (element.points > 10) {
          return element.points <= 100
        }
      })
    } else if (difficulty === 'hard') {
      return list.filter(function (element, index, array) {
        if (element.points > 100) {
          return element.points <= 1000
        }
      })
    }
  }
}).filter('orderByFilter', function () {
  return function (items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function (item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if (reverse) filtered.reverse();
    return filtered;
  };
}).filter('submissionFilter', function () {
  return function (items, team) {
    if (!team) {
      return []
    }
    return items.filter(function (item) {
      if (item.team === team._id) {
        return item
      }
    })
  };
});

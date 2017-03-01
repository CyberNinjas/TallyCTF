'use strict';

angular.module('ctfEvents').factory('Cache', function (CacheFactory) {
  var eventCache = CacheFactory.get('eventCache');

  return {
    invalidate: function (key) {
      if (!eventCache) {
        return
      }
      eventCache.remove(key);
    },
    keys: function () {
      console.log(eventCache.keys());
    },
    invalidateAll: function () {
      if (!eventCache) {
        return
      }
      eventCache.remove('api/ctfEvent');
      eventCache.removeAll();
    }
  }
});

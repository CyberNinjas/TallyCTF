'use strict';

angular.module('ctfEvents').factory('Cache', function (CacheFactory) {
  var $httpDefaultCache = CacheFactory.get('eventCache');
  return {
    invalidate: function (key) {
      $httpDefaultCache.remove(key);
    },
    keys: function () {
      console.log($httpDefaultCache.keys());
    },
    invalidateAll: function () {
      $httpDefaultCache.remove('api/ctfEvent');
      $httpDefaultCache.removeAll();
    }
  }
});
'use strict';

//CtfEvents service used for communicating with the ctfEvents REST endpoints
angular.module('ctfEvents').factory('CtfEvents', ['$resource', 'CacheFactory',
  function ($resource, CacheFactory) {
    var eventCache;
    if (!CacheFactory.get('eventCache')) {
      eventCache = CacheFactory('eventCache', {
        maxAge: 15 * 60 * 1000,
        recycleFreq: 60000,
        cacheFlushInterval: 60 * 60 * 1000,
        storageMode: 'localStorage',
        deleteOnExpire: 'aggressive'
      });
    }

    return $resource('api/ctfEvents/:ctfEventId', {
      ctfEventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        method: 'GET',
        cache: eventCache,
        isArray : true,
      },
      get: {
        method: 'GET',
        cache: eventCache,
      }
    });
  }
]);

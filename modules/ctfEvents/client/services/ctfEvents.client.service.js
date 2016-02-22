'use strict';

//CtfEvents service used for communicating with the ctfEvents REST endpoints
angular.module('ctfEvents').factory('CtfEvents', ['$resource',
  function ($resource) {
    return $resource('api/ctfEvents/:ctfEventId', {
      ctfEventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

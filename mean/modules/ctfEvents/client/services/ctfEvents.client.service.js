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
]).factory('CurrentCtfEvents', ['$resource',
  function ($resource) {
    return $resource('api/ctfEvents/current', {}, {
      update: {
        method: 'POST'
      },
      load: {
        method: 'PUT'
      },
      clear: {
        method: 'DELETE'
      }
    });
  }
]);

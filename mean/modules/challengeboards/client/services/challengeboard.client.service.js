'use strict';

//Challengeboards service used for communicating with the challengeboards REST endpoints
angular.module('challengeboards').factory('Challengeboards', ['$resource',
  function ($resource) {
    return $resource('api/challengeboards/:challengeboardId', {
      challengeboardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

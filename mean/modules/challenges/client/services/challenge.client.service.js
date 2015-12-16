'use strict';

//Challenges service used for communicating with the challenges REST endpoints
angular.module('challenges').factory('Challenges', ['$resource',
  function ($resource) {
    return $resource('api/challenges/:challengeId', {
      challengeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      submit: {
        url: 'api/challenges/:challengeId/submit',
        method: 'POST'
      }
    });
  }
]);

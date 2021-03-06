'use strict';

angular.module('challenges').factory('Challenges', ['$resource',
  function ($resource) {
    return $resource('api/challenges/:challengeId', {
      challengeId: '@_id'
    },
      {
        update: {
          method: 'PUT'
        },
        create: {
          url: 'api/challenges/new',
          method: 'POST'
        },
        submit: {
          url: 'api/challenges/:challengeId/submit',
          method: 'POST'
        }
      });
  }
]);

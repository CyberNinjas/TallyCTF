'use strict';

//User Auths service used for communicating with the articles REST endpoints
angular.module('userAuths').factory('UserAuths', ['$resource',
  function ($resource) {
    return $resource('api/userAuths/:userAuthId', {
      userAuthId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

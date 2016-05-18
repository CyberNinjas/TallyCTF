'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users')
  .factory('Users', ['$resource',
  function ($resource) {
      return $resource('api/users', {
        teamId: '@_id'
      }, {
        update: {
          method: 'PUT'
        },
        listAvailableUsers: {
          url: 'api/users/listAvailable/:teamId',
          method: 'GET',
          isArray: true
        }
      });
  }
]);

//TODO this should be Users service
angular.module('users.admin')
  .factory('Admin', ['$resource',
  function ($resource) {
      return $resource('api/users/:userId', {
        userId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
  }
]);

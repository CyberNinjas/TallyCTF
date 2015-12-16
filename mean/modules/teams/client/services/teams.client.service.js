'use strict';

//Teams service used for communicating with the teams REST endpoints
angular.module('teams')
  .factory('Teams', ['$resource',
    function ($resource) {
      return $resource('api/teams/:teamId', {
        teamId: '@_id'
      }, {
        findRequests: {
          url: 'api/teams/requests',
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT'
        },
        getRaw: {
          url: 'api/teams/:teamId/raw',
          method: 'GET'
        }
      });
    }
  ])
.factory('TeamsCtl', ['$resource',
  function ($resource) {
    return $resource('api/teams/:teamId.:userId/ctl', {
      teamId: '@_id',
      userId: '@temp'
    }, {
      accept: {
        method: 'POST'
      },
      decline: {
        method: 'PUT'
      },
      askToJoin: {
        url: 'api/teams/:teamId.:userId/join',
        method: 'PUT'
      },
      requestToJoin: {
        url: 'api/teams/:teamId.:userId/join',
        method: 'PATCH'
      },
      remove: {
        method: 'PATCH'
      }
    });
  }
]);

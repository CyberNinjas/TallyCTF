'use strict';

angular.module('teams')
  .factory('Teams', ['$resource',
    function ($resource) {
      return $resource('/api/teams/:teamId', {
        teamId: '@team'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  ]);

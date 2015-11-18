'use strict';

//Teams service used for communicating with the teams REST endpoints
angular.module('teams')
    .factory('Teams', ['$resource',
      function ($resource) {
       return $resource('api/teams/:teamId', {
          teamId: '@_id'
        }, {
         update: {
            method: 'PUT'
         }
    });
  }
])
.factory('Teams1', ['$resource',
  function ($resource) {
   return $resource('api/teams/join', {}, {
     update: {
        method: 'PUT'
     }
});
}
]);

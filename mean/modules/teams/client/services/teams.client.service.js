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
]);

/*.factory('Teams', ['$rootScope', function ($rootScope) {
    var notify = {};

      notify.sendMsg = function(msg, data){
        data = data || {};
        $rootScope.$emit(msg,data);
        console.log('message sent');

      };

      notify.getMsg = function(msg,func,scope) {

        var unbind = $rootScope.$on(msg,func);
        if(scope){
          scope.$on('destroy',unbind)
        }
      };
  }
]);
*/

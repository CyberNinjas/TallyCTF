'use strict';

//ScoreBoards service used for communicating with the scoreBoards REST endpoints
angular.module('scoreBoards').factory('ScoreBoards', ['$resource',
  function ($resource) {
    return $resource('api/scoreBoards/:scoreBoardId', {
      scoreBoardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

//ScoreBoard service used for communicating with the scoreBoard REST endpoints
angular.module('scoreBoard').factory('ScoreBoard', ['$resource',
  function ($resource) {
    return $resource('api/scoreBoard/:scoreBoardTeamId', {
      scoreBoardTeamId: '@team._id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

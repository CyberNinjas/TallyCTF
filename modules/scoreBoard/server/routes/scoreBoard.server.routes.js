'use strict';

/**
 * Module dependencies.
 */
var scoreBoardPolicy = require('../policies/scoreBoard.server.policy.js'),
  scoreBoard = require('../controllers/scoreBoard.server.controller.js');

module.exports = function (app) {
  // ScoreBoard collection routes
  app.route('/api/scoreBoard').all(scoreBoardPolicy.isAllowed)
    .get(scoreBoard.list);
    //.post(scoreBoard.create);

  // Single scoreBoard routes
  app.route('/api/scoreBoard/:scoreBoardTeamId').all(scoreBoardPolicy.isAllowed)
    .get(scoreBoard.read)
    .put(scoreBoard.update);


  // Finish by binding the scoreBoard middleware
  app.param('scoreBoardTeamId', scoreBoard.scoreBoardByTeamID);
};

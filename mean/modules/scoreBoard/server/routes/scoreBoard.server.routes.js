'use strict';

/**
 * Module dependencies.
 */
var scoreBoardPolicy = require('../policies/scoreBoard.server.policy'),
  scoreBoard = require('../controllers/scoreBoard.server.controller');

module.exports = function (app) {
  // ScoreBoard collection routes
  app.route('/api/scoreBoard').all(scoreBoardPolicy.isAllowed)
    .get(scoreBoard.list)
    .post(scoreBoard.create);

  // Single scoreBoard routes
  app.route('/api/scoreBoard/:scoreBoardId').all(scoreBoardPolicy.isAllowed)
    .get(scoreBoard.read)
    .put(scoreBoard.update)
    .delete(scoreBoard.delete);

  // Finish by binding the scoreBoard middleware
  app.param('scoreBoardId', scoreBoard.scoreBoardByID);
};

'use strict';

/**
 * Module dependencies.
 */
var scoreBoardsPolicy = require('../policies/scoreBoards.server.policy'),
  scoreBoards = require('../controllers/scoreBoards.server.controller');

module.exports = function (app) {
  // ScoreBoards collection routes
  app.route('/api/scoreBoards').all(scoreBoardsPolicy.isAllowed)
    .get(scoreBoards.list)
    .post(scoreBoards.create);

  // Single scoreBoard routes
  app.route('/api/scoreBoards/:scoreBoardId').all(scoreBoardsPolicy.isAllowed)
    .get(scoreBoards.read)
    .put(scoreBoards.update)
    .delete(scoreBoards.delete);

  // Finish by binding the scoreBoard middleware
  app.param('scoreBoardId', scoreBoards.scoreBoardByID);
};

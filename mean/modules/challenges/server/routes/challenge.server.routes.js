'use strict';

/**
 * Module dependencies.
 */
var challengesPolicy = require('../policies/challenge.server.policy.js'),
  challenges = require('../controllers/challenge.server.controller.js');

module.exports = function (app) {
  // Challenges collection routes
  app.route('/api/challenges').all(challengesPolicy.isAllowed)
    .get(challenges.list)
    .post(challenges.create);

  // Single challenges routes
  app.route('/api/challenges/:challengeId').all(challengesPolicy.isAllowed)
    .get(challenges.read)
    .put(challenges.update)
    .delete(challenges.delete);

  // Finish by binding the challenges middleware
  app.param('challengeId', challenges.challengeByID);
};

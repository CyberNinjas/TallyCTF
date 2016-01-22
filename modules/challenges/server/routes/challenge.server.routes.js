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

  //route for submitting a challenge, uses different policy than the rest
  app.route('/api/challenges/:challengeId/submit').all(challengesPolicy.isAllowedSubmit)
      .post(challenges.submit);

  //Create New Challenge / Return Default Value
  app.route('/api/challenges/new').all(challengesPolicy.isAllowed)
      .get(challenges.default)
      .post(challenges.updateOrCreate);

  // Get / Update / Delete Challenge
  app.route('/api/challenges/:challengeId').all(challengesPolicy.isAllowed)
    .get(challenges.read)
    .put(challenges.updateOrCreate)
    .delete(challenges.delete);

  // Finish by binding the challenges middleware
  app.param('challengeId', challenges.challengeByID);
};

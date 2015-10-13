'use strict';

/**
 * Module dependencies.
 */
var challengeboardsPolicy = require('../policies/challengeboard.server.policy.js'),
  challengeboards = require('../controllers/challengeboard.server.controller.js');

module.exports = function (app) {
  // Challengeboards collection routes
  app.route('/api/challengeboards').all(challengeboardsPolicy.isAllowed)
    .get(challengeboards.list)
    .post(challengeboards.create);

  // Single challengeboards routes
  app.route('/api/challengeboards/:challengeboardId').all(challengeboardsPolicy.isAllowed)
    .get(challengeboards.read)
    .put(challengeboards.update)
    .delete(challengeboards.delete);

  // Finish by binding the challengeboards middleware
  app.param('challengeboardId', challengeboards.challengeboardByID);
};

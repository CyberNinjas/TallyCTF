'use strict';

/**
 * Module dependencies.
 */
var teamsPolicy = require('../policies/teams.server.policy'),
  teams = require('../controllers/teams.server.controller');

module.exports = function (app) {
  // Teams collection routes
  app.route('/api/teams').all(teamsPolicy.isAllowed)
    .get(teams.list)
    .post(teams.create)
    .delete(teams.clear)
    .put(teams.requestsToJoin);
  // Single team routes
  app.route('/api/teams/:teamId').all(teamsPolicy.isAllowed)
    .get(teams.read)
    .put(teams.requestsToJoin)
    .delete(teams.delete);
  // Finish by binding the team middleware
  app.param('teamId', teams.teamByID);
};

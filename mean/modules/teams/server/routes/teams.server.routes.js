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
    .delete(teams.clear);

  /*  app.route('/api/teams/join').all(teamsPolicy.isAllowed)
      .put(teams.addMembers);
  */

  // Single team routes
  app.route('/api/teams/utils').all(teamsPolicy.isAllowed)
    .get(teams.listUsers);
    
  app.route('/api/teams/:teamId').all(teamsPolicy.isAllowed)
    .get(teams.read)
    .put(teams.update)
    .delete(teams.delete);

  app.route('/api/teams/:teamId.:userId/join').all(teamsPolicy.isAllowed)
        .put(teams.addMembers);

  app.route('/api/teams/:teamId.:userId/ctl').all(teamsPolicy.isAllowedToAccept)
      .put(teams.decline)
      .post(teams.accept)
      .patch(teams.removeMember);


  // Finish by binding the team middleware
  app.param('teamId', teams.teamByID);
};

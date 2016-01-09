'use strict';

/**
 * Module dependencies.
 */
var teamsPolicy = require('../policies/teams.server.policy.js'),
  teams = require('../controllers/teams.server.controller.js');

module.exports = function (app) {
  // Teams collection routes
  app.route('/api/teams').all(teamsPolicy.isAllowed)
    .get(teams.list)
    .post(teams.create)
    .delete(teams.clear);

  app.route('/api/teams/requests').all(teamsPolicy.isAllowed)
    .get(teams.findRequests);

  app.route('/api/teams/asks').all(teamsPolicy.isAllowed)
        .get(teams.findAsks);


  // Single team routes
  app.route('/api/teams/:teamId').all(teamsPolicy.isAllowed)
    .get(teams.read)
    .put(teams.update)
    .delete(teams.delete);
    //route for team MiddleWare(with no populates)
  app.route('/api/teams/:teamIdRaw/raw').all(teamsPolicy.isAllowed)
    .get(teams.read);
    //rotue for askToJoin and requestToJoin
  app.route('/api/teams/:teamId.:userId/join').all(teamsPolicy.isAllowed)
        .put(teams.askToJoin)
        .patch(teams.requestToJoin);
    //route for accepting,declining, and removing member
  app.route('/api/teams/:teamId.:userId/ctl').all(teamsPolicy.isAllowedToAccept)
      .put(teams.decline)
      .post(teams.accept)
      .patch(teams.removeMember);


  // Finish by binding the team middleware
  app.param('teamId', teams.teamByID);
  app.param('teamIdRaw', teams.teamByIDRaw);
};

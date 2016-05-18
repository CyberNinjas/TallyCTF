'use strict';

/**
 * Module dependencies.
 */
var teamsPolicy = require('../policies/teams.server.policy.js'),
  teamUtil = require('../controllers/teamUtil.server.controller.js'),
  teamCrud = require('../controllers/teamCrud.server.controller.js'),
  teamDraft = require('../controllers/teamDraft.server.controller.js'),
  teamMembership = require('../controllers/teamMembership.server.controller.js');

module.exports = function (app) {
  // Teams collection routes
  app.route('/api/teams').all(teamsPolicy.isAllowed)
    .get(teamUtil.list)
    .post(teamCrud.create)
  app.route('/api/teams/requests').all(teamsPolicy.isAllowed)
    .get(teamMembership.findRequests);
  app.route('/api/teams/asks').all(teamsPolicy.isAllowed)
    .get(teamMembership.findAsks);

  // Single team routes
  app.route('/api/teams/:teamId').all(teamsPolicy.isAllowed)
    .get(teamCrud.read)
    .put(teamCrud.update)
    .delete(teamCrud.delete);
  //route for team MiddleWare(with no populates)
  app.route('/api/teams/:teamIdRaw/raw').all(teamsPolicy.isAllowed)
    .get(teamCrud.read);
  //rotue for askToJoin and requestToJoin
  app.route('/api/teams/:teamId.:userId/join').all(teamsPolicy.isAllowed)
    .put(teamDraft.askToJoin)
    .patch(teamDraft.requestToJoin);
  //route for accepting,declining, and removing member
  app.route('/api/teams/:teamId.:userId/ctl').all(teamsPolicy.isAllowedToAccept)
    .put(teamDraft.decline)
    .post(teamDraft.accept)
    .patch(teamMembership.removeMember);

  // Finish by binding the team middleware
  app.param('teamId', teamUtil.teamByID);
  app.param('teamIdRaw', teamUtil.teamByIDRaw);
};

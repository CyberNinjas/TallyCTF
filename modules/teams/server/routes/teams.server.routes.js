'use strict';

var teamsPolicy = require('../policies/teams.server.policy.js'),
  teams = require('../controllers/teams.server.controller.js')

module.exports = function (app) {
  app.route('/api/teams')
    .all(teamsPolicy.isAllowed)
    .get(teams.list)
    .post(teams.create)
    .put(teams.update)
  app.route('/api/teams/:teamId')
    .all(teamsPolicy.isAllowed)
    .delete(teams.delete)
    .get(teams.read)
};

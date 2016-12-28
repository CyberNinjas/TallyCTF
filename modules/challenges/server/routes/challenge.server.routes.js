'use strict'

var challengesPolicy = require('../policies/challenge.server.policy.js')
var challenges = require('../controllers/challenge.server.controller.js')

module.exports = function (app) {
  app.route('/api/challenges').all(challengesPolicy.isAllowed)
  .get(challenges.list)

  // app.route('/api/challenges/:challengeId/submit').all(challengesPolicy.isAllowedSubmit)
  // .post(challenges.submit)

  app.route('/api/challenges/new')
  //.all(challengesPolicy.isAllowed)
  .get(challenges.default)
  .put(challenges.updateOrCreate)

  app.route('/api/challenges/:challengeId').all(challengesPolicy.isAllowed)
  .get(challenges.read)
  .put(challenges.updateOrCreate)
  .delete(challenges.delete)

  app.param('challengeId', challenges.challengeByID)
}

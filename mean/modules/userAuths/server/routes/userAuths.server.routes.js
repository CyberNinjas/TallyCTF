'use strict';

/**
 * Module dependencies.
 */
var userAuthsPolicy = require('../policies/userAuths.server.policy'),
  userAuths = require('../controllers/userAuths.server.controller');

module.exports = function (app) {
  // User Auths collection routes
  app.route('/api/userAuths').all(userAuthsPolicy.isAllowed)
    .get(userAuths.list)
    .post(userAuths.create);

  // Single user auth routes
  app.route('/api/userAuths/:userAuthId').all(userAuthsPolicy.isAllowed)
    .get(userAuths.read)
    .put(userAuths.update)
    .delete(userAuths.delete);

  // Setup custom auth routes
  app.route('/api/auth/userAuths/:userAuthProvider').get(userAuths.oauthCall);
  app.route('/api/auth/userAuths/:userAuthProvider/callback').get(userAuths.oauthCallback);

  // Finish by binding the user auth middleware
  app.param('userAuthId', userAuths.userAuthByID);
  app.param('userAuthProvider', userAuths.userAuthByProvider);
};

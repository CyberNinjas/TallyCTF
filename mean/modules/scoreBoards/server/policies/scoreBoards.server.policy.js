'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke ScoreBoards Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/scoreBoards',
      permissions: '*'
    }, {
      resources: '/api/scoreBoards/:scoreBoardId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/scoreBoards',
      permissions: ['get', 'post']
    }, {
      resources: '/api/scoreBoards/:scoreBoardId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/scoreBoards',
      permissions: ['get']
    }, {
      resources: '/api/scoreBoards/:scoreBoardId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If ScoreBoards Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an scoreBoard is being processed and the current user created it then allow any manipulation
  if (req.scoreBoard && req.user && req.scoreBoard.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

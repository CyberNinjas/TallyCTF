'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Teams Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/teams',
      permissions: '*'
    }, {
      resources: '/api/teams/accept',
      permissions: '*'
    },
      {
        resources: '/api/teams/decline',
        permissions: '*'
      },
      {
        resources: '/api/teams/join',
        permissions: '*'
      },{
      resources: '/api/teams/:teamId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/teams',
      permissions: ['get', 'post','put']
    }, {
      resources: '/api/teams/:teamId',
      permissions: ['get','put', 'post']
    }]
  }, {
    roles: ['teamCaptain'],
    allows: [
      {
        resources: '/api/teams/accept',
        permissions: '*'
      },
      {
        resources: '/api/teams/decline',
        permissions: '*'
      }
    ]
  },{
    roles: ['guest'],
    allows: [{
      resources: '/api/teams',
      permissions: ['get']
    }, {
      resources: '/api/teams/:teamId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Teams Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
  // If an team is being processed and the current user created it then allow any manipulation
  if (req.team && req.user && req.user.team==='') {
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

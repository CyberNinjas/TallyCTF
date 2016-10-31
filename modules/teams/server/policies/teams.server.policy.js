'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());

exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/teams',
      permissions: '*'
    }, {
      resources: '/api/teams/:teamId',
      permissions: '*'
    }]
  }, {
    roles: ['teamCaptain'],
    allows: [{
      resources: '/api/teams',
      permissions: '*'
    }, {
      resources: '/api/teams/:teamId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/teams',
      permissions: '*'
    }, {
      resources: '/api/teams/:teamId',
      permissions: ['get']
    }]
  }, {
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

exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
  if (req.team && req.user && req.user.team === '') {
    return next();
  }
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(),
  function (err, isAllowed) {
    if (err) {
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

exports.isAllowedToAccept = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(),
  function (err, isAllowed) {
    if (err) {
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

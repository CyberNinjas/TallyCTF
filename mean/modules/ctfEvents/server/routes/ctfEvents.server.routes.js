'use strict';

/**
 * Module dependencies.
 */
var ctfEventsPolicy = require('../policies/ctfEvents.server.policy'),
  ctfEvents = require('../controllers/ctfEvents.server.controller');

module.exports = function (app) {
  // CtfEvents collection routes
  app.route('/api/ctfEvents').all(ctfEventsPolicy.isAllowed)
    .get(ctfEvents.list)
    .post(ctfEvents.create);

  // Single ctfEvent routes
  app.route('/api/ctfEvents/:ctfEventId').all(ctfEventsPolicy.isAllowed)
    .get(ctfEvents.read)
    .put(ctfEvents.update)
    .delete(ctfEvents.delete);

  // Finish by binding the ctfEvent middleware
  app.param('ctfEventId', ctfEvents.ctfEventByID);
};

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

  // Current ctfEvent routes
  app.route('/api/ctfEvents/current').all(ctfEventsPolicy.isAllowed)
    .get(ctfEvents.readCurrent)
    .put(ctfEvents.setCurrent)
    .post(ctfEvents.setCurrent)
    .delete(ctfEvents.clear);

  // Event loading routes
  app.route('/api/ctfEvents/current/eventLoad').all(ctfEventsPolicy.isAllowed)
    .put(ctfEvents.eventLoad);

  // Single ctfEvent routes
  app.route('/api/ctfEvents/:ctfEventId').all(ctfEventsPolicy.isAllowed)
    .get(ctfEvents.read)
    .put(ctfEvents.update)
    .delete(ctfEvents.delete);

  // Finish by binding the ctfEvent middleware
  app.param('ctfEventId', ctfEvents.ctfEventByID);
};

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

  app.route('/api/ctfEvents/currentEvent').all(ctfEventsPolicy.isAllowed)
      .get(ctfEvents.getCurrent);

  app.route('/api/ctfEvents/currentEvent/:ctfEventId').all(ctfEventsPolicy.isAllowed)
      .put(ctfEvents.setCurrent);

  // Finish by binding the ctfEvent middleware
  app.param('ctfEventId', ctfEvents.ctfEventByID);
};

'use strict';
/**
 * Module dependencies.
 */
var passport = require('passport'),
    OIDCStrategy = require('passport-azure-ad').OIDCStrategy,
    users = require('../../controllers/users.server.controller');
module.exports = function (config) {
  passport.use(new OIDCStrategy({
      identityMetadata: 'https://login.microsoftonline.com/common/.well-known/openid-configuration',
      clientID: config['azuread-openidconnect'].clientID,
      responseType: 'id_token',
      responseMode: 'form_post',
      redirectUrl: process.env.AZUREAD_REPLY_URL,
      allowHttpForRedirectUrl: (config.secure && config.secure.ssl === true) ? false : true,
      clientSecret: config['azuread-openidconnect'].clientSecret,
      validateIssuer: false,
      isB2C: false,
      issuer: null,
      passReqToCallback: true,
      scope: ['profile', 'email'],
      loggingLevel: 'info',
      nonceLifetime: null,
      },
      function(req, iss, sub, profile, done) {
        // Create the user OAuth profile
        var providerUserProfile = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          displayName: profile.displayName,
          email: profile.upn,
          username:  profile.upn,
          upn: profile.upn,
          provider: 'azuread-openidconnect',
          providerIdentifierField: 'upn',
          providerData: profile._json
        };
        // Save the user OAuth profile
        users.saveOAuthUserProfile(req, providerUserProfile, done);
      }
  ));
};

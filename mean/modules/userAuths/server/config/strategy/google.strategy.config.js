'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  users = require(path.resolve('./modules/users/server/controllers/users.server.controller'));

module.exports = function (userAuth) {
  // Use google strategy
  passport.use(new GoogleStrategy({
      clientID: userAuth.clientId || 'EMPTY',
      clientSecret: userAuth.clientSecret || 'EMPTY',
      callbackURL: userAuth.callbackURL || 'EMPTY',
      scope: userAuth.scope || 'EMPTY',
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        profileImageURL: (providerData.picture) ? providerData.picture : undefined,
        provider: 'google',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};

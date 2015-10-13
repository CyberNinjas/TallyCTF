'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  OAuthStrategy = require('passport-oauth2').Strategy,
  users = require(path.resolve('./modules/users/server/controllers/users.server.controller'));

module.exports = function (userAuth) {
  console.log("RUNNING WITH: " + userAuth.provider);
  passport.use(new OAuthStrategy({
      authorizationURL: userAuth.authURL || 'EMPTY',
      tokenURL: userAuth.tokenURL || 'EMPTY',
      userInfoURL: userAuth.userInfoURL || 'EMPTY',
      clientID: userAuth.clientId || 'EMPTY',
      clientSecret: userAuth.clientSecret || 'EMPTY',
      callbackURL: userAuth.callbackURL || 'EMPTY',
      scope: userAuth.scope || 'user email',
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      console.log(profile);
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile._json.email,
        username: profile.username,
        provider: userAuth.provider,
        providerIdentifierField: 'user_id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};

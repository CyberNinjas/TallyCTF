'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  FacebookStrategy = require('passport-facebook').Strategy,
  users = require(path.resolve('./modules/users/server/controllers/users.server.controller'));

module.exports = function (userAuth) {
  // Use facebook strategy
  passport.use(new FacebookStrategy({
    clientID: userAuth.clientId,
    clientSecret: userAuth.clientSecret,
    callbackURL: userAuth.callbackURL,
    profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    let providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    // Create the user OAuth profile
    let providerUserProfile = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      displayName: profile.displayName,
      email: profile.emails ? profile.emails[0].value : undefined,
      username: profile.username || generateUsername(profile),
      profileImageURL: (profile.id) ? '//graph.facebook.com/' + profile.id + '/picture?type=large' : undefined,
      provider: 'facebook',
      providerIdentifierField: 'id',
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);

      function generateUsername(profile) {
        let username = '';

        if (profile.emails) {
          username = profile.emails[0].value.split('@')[0];
        } else if (profile.name) {
          username = profile.name.givenName[0] + profile.name.familyName;
        }

        return username.toLowerCase() || undefined;
      }
    }
  ));
};

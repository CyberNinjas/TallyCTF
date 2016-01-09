'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  LinkedInStrategy = require('passport-linkedin').Strategy,
  users = require(path.resolve('./modules/users/server/controllers/users.server.controller'));

module.exports = function (userAuth) {
  // Use linkedin strategy
  passport.use(new LinkedInStrategy({
    consumerKey: userAuth.clientId,
    consumerSecret: userAuth.clientSecret,
    callbackURL: userAuth.callbackURL,
    passReqToCallback: true,
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'picture-url']
  },
    function (req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;
      console.log(profile);

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: (profile.emails ? profile.emails[0].value : ''),
        username: profile.id,
        profileImageURL: (providerData.pictureUrl) ? providerData.pictureUrl : undefined,
        provider: 'linkedin',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};

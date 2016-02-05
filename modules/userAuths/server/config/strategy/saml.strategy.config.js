'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  SamlStrategy = require('passport-saml').Strategy,
  users = require(path.resolve('./modules/users/server/controllers/users.server.controller'));

module.exports = function (userAuth) {
  passport.use(new SamlStrategy({
    path: '/api/auth/userAuths/ccx/callback',
    logoutCallbackUrl: '/api/auth/userAuths/ccx/callback',
    entryPoint: 'https://monsterccxssoqa.hooplabeta.com/saml/auth/',
    issuer: 'TallyCTF',
    cert: process.env.cert,
    decryptionPvk: process.env.cert,
    authnRequestBinding: 'HTTP-POST',
    identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
    skipRequestCompression: true,
    passReqToCallback: true
  },
  function (req, profile, done) {
    var providerUserProfile = {
      firstName: profile.First,
      lastName: profile.Last,
      displayName: profile.DisplayName,
      email: profile.nameID,
      username: profile.Username,
      provider: 'CCX',
      providerIdentifierField: 'nameID',
      providerData: profile
    };
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }
  ));
};

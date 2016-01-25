'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    path = require('path'),
    SamlStrategy = require('passport-saml').Strategy,
    users = require(path.resolve('./modules/users/server/controllers/users.server.controller'));

module.exports = function (userAuth) {
    passport.use(new SamlStrategy({
            path: userAuth.callbackURL,
            entryPoint: userAuth.scope,
            issuer: 'passport-saml',
            cert: 'MIIEIzCCAwugAwIBAgIUbCayTa8KFwGJ6txCkisGL8Kpg+gwDQYJKoZIhvcNAQEFBQAwXDELMAkGA1UEBhMCVVMxFTATBgNVBAoMDGN5YmVyIG5pbmphczEVMBMGA1UECwwMT25lTG9naW4gSWRQMR8wHQYDVQQDDBZPbmVMb2dpbiBBY2NvdW50IDc1ODI0MB4XDTE2MDExMzE3MzI0NVoXDTIxMDExNDE3MzI0NVowXDELMAkGA1UEBhMCVVMxFTATBgNVBAoMDGN5YmVyIG5pbmphczEVMBMGA1UECwwMT25lTG9naW4gSWRQMR8wHQYDVQQDDBZPbmVMb2dpbiBBY2NvdW50IDc1ODI0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4Tyz+Ap3vabk78wldbp90J0MJCamwVqXqT2XePbarkfpPRS1k4vjn5TEjaKXhvV/rruM3GNAfN688iV/HhrlCoGWWr7MXmtAgkEK4fnkfnTB85Vt3JZ3e9nAyBg9j/ipAOlDqcUnaelhL08QNnunvxkP7hjQk643JfEu+LZ02oDPpvCSni992Rap/FnU6DfIGYddxzKFfTpvV8g0ZYmnWB6X92Op0i10UpDcetE3K3yUZTOVtLOhDxJYQKYhLokdZ/agkrHVMJzCPDZvpn7voox7bIWqXadzkyFBoNQiSfVjRFT4yJjPvjwHdhOsz6jpmS339EpFKzTkM1q3v6BFDQIDAQABo4HcMIHZMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFGm+k2S5rPw+CUjh1NCy88j3RxUvMIGZBgNVHSMEgZEwgY6AFGm+k2S5rPw+CUjh1NCy88j3RxUvoWCkXjBcMQswCQYDVQQGEwJVUzEVMBMGA1UECgwMY3liZXIgbmluamFzMRUwEwYDVQQLDAxPbmVMb2dpbiBJZFAxHzAdBgNVBAMMFk9uZUxvZ2luIEFjY291bnQgNzU4MjSCFGwmsk2vChcBiercQpIrBi/CqYPoMA4GA1UdDwEB/wQEAwIHgDANBgkqhkiG9w0BAQUFAAOCAQEAcC28OUyNjlehEp+aYouhaMNu/UEbC5cbov9ynFT3/lPxjGQzI0fQlZ5uipD5mBY6Ng4obZ9LQi7rrejnISYjhDOhKdYI0DJr0qVVMOC1ZsIUJbG1zuH/vlm7UG6FhRAdOrVBFUJCUiKbxzoLNiX+qG4Qqwn5BxcLHv1k0Eg5fNM4K5dEGfO23Lol8MjkBB8YFpi0vXZ2S6UMjS63QjVyCv+SekYhOKekrpHjcBh3MoAjcPC3j3Ysr1hZRYXJc9g5d9Bl0uQA7Sbk1Xz5hOjoTmHZihx8duHfm2sQtcHzfhbNXXtW87iK++gxbyM1TZMuVJOD7yxuvx21PbE3rGn67w==',
            passReqToCallback: true

        },
        function (req, profile, done) {
            var providerData = profile;
            var providerUserProfile = {
                firstName: profile.First,
                lastName: profile.Last,
                displayName: profile.DisplayName,
                email: profile.nameID,
                username: profile.Username,
                provider: 'onelogin',
                providerIdentifierField: 'nameID',
                providerData: providerData
            };
            users.saveOAuthUserProfile(req, providerUserProfile, done);
        }
    ));
};

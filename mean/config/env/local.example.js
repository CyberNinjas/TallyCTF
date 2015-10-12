'use strict';

// Rename this file to local.js for having a local configuration variables that
// will not get commited and pushed to remote repositories.
// Use it for your API keys, passwords, etc.

/* For example:
 ​
 module.exports = {
 db: {
 uri: 'mongodb://localhost/local-dev',
 options: {
 user: '',
 pass: ''
 }
 },
 facebook: {
 clientID: process.env.FACEBOOK_ID || 'APP_ID',
 clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
 callbackURL: '/api/auth/facebook/callback'
 }
 };
 */

module.exports = {
  db: {
    uri: 'mongodb://justchoose.me:25565/group9a',
    options: {
      user: 'cyber',
      pass: 'ninjas'
    }
  },
  google: {
    clientID: process.env.GOOGLE_ID || '603376827845-24agn835cc74v84hc52v9vdco3sb9oda.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'QpkR-FZkYsacM4WzZqVMMP4H',
    callbackURL: '/api/auth/google/callback'
  }
};

'use strict';

module.exports = {
  app: {
    title: 'TallyCTF',
    description: 'CTF Scoreboard & Event Management',
    keywords: 'infosec, security, ctf, event, competition, scoreboard',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    httpOnly: true,
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
      }
    }
  }
};

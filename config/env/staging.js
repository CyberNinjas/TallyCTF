'use strict';

//Staging File. This will be on Azure.

var defaultEnvConfig = require('./default');

module.exports = {
  //See http://expressjs.com/en/guide/behind-proxies.html
  trustedProxies : 'uniquelocal',
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'combined',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.cwd(),
        fileName: 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: false, // activate to use rotating logs
          fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: 'daily',
          verbose: false
        }
      }
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  livereload: true
};

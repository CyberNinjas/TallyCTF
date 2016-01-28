'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  seed = require('./seed'),
  chalk = require('chalk'),
  SamlStrategy = require('passport-saml').Strategy,
  forge = require('node-forge');

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();

    var rsa = forge.pki.rsa
    var pki = forge.pki

    var keypair = rsa.generateKeyPair({ bits:2048 })
    var publicPem = pki.publicKeyToPem(keypair.publicKey)
    var privatePem = pki.privateKeyToPem(keypair.privateKey)

    console.log('Public:' + publicPem)
    console.log('Private:' + privatePem)

    var saml = new SamlStrategy({
      path: '/api/auth/userAuths/ccx/callback',
      entryPoint: 'https://monsterccxssoqa.hooplabeta.com/saml/auth/',
      issuer: 'passport-saml',
      privateCert: publicPem,
      decryptionPvk: publicPem,
      cert: 'MIIGITCCBAmgAwIBAgIJAKOq+OS528PJMA0GCSqGSIb3DQEBBQUAMIGmMQswCQYDVQQGEwJVUzEL MAkGA1UECAwCU0MxFzAVBgNVBAcMDk1vdW50IFBsZWFzYW50MRwwGgYDVQQKDBNTb2NpYWwgU3Ry YXRhLCBJbmMuMScwJQYDVQQDDB5tb25zdGVyY2N4c3NvcWEuaG9vcGxhYmV0YS5jb20xKjAoBgkq hkiG9w0BCQEWG29wZXJhdGlvbnNAc29jaWFsc3RyYXRhLmNvbTAeFw0xNTA5MjgyMjEyMTVaFw0y NTA5MjUyMjEyMTVaMIGmMQswCQYDVQQGEwJVUzELMAkGA1UECAwCU0MxFzAVBgNVBAcMDk1vdW50 IFBsZWFzYW50MRwwGgYDVQQKDBNTb2NpYWwgU3RyYXRhLCBJbmMuMScwJQYDVQQDDB5tb25zdGVy Y2N4c3NvcWEuaG9vcGxhYmV0YS5jb20xKjAoBgkqhkiG9w0BCQEWG29wZXJhdGlvbnNAc29jaWFs c3RyYXRhLmNvbTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAMzPU09UbkTb2Pe1Dwud DAK32AwSQjnEKbzJRDPxA3Qs4+kw82sWPvF/uPPL7HWnswv30ISRDjld1JKJLrFWvuyYtKbc7AkU 8/xEoalbN+SMxzhTEyVdUk2V3pY5ywqVuNeNq+oKe7NLfkTvRcs0euVxP7dCJO04IDV592BcdCMy 6g1R5C7EBYW11053IVxnEN6GN0pQQIO7x3W4whh0F2sQ4U0TLPRF0BQvqYXR81YQjfTnYJS3DGgq QehaQCcSS8maMlvvGldLvffORAJgOyp5rJVae8StUJFXlHtb2n/OWeqte3hg3kvqMBWn+p3v/ZM2 xvh1Xjz5X+e9BH6bprRgHg0NMn7rw7JcwjvtuHhw4Txs9KyXuFiy5D4SyPhT+7fPXtRx06NK5XoU cmPD3/bfbUlFPU1SoFC1tbvkUqSTIQ6SXBfWxi8gbrGbn/ckyLzXWrBaU9nmghMqSzgvjRN+fVJR 9Or7Mcbka1mB2wOWx0gTTjqQLc+U9ZhVW/wASYioj2ppzzXZBHUU3qqGCHa6itdQZqZeoRyrySMw D6sHWqEREq5SCGw2mz6FRLd6zXFfwhLU0wzYO6PcNnNAOb/2e7KSUZgQtRUGz7n5uWKHwgCD2nrM JQ0b6ejSD3MBUeGLni0Pih2sJ80JcnU8H2qamL7/TJWK8fpGeEckCujdAgMBAAGjUDBOMB0GA1Ud DgQWBBRUJ4g8F56ukm1ehtzE3qedmkdA6zAfBgNVHSMEGDAWgBRUJ4g8F56ukm1ehtzE3qedmkdA 6zAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4ICAQCXbOpI5UlYwnFwh3A9M5nTkeH/0Mzt JM9bn2QS2ZJZStvf/YwEx/SmdHMLEimeB2Ee29YZWR8SDxiVcFA6+lXM9Lp7Ufm4MjASoXoyZtki fVrE8LWWm4wshiq1Lpeuwxxgp8I4k70/70cDRmLETODbct1FoQaHhpE/K2CrItmylMOZIu7m9Ud1 W2pMpyhBZPut663RaZzPrONyGLEQBuDYke8sLEAFLF0wozK7QIzmK96ClutUc6FdTTCgwmn2qDXr dZzEgE4x2Qgkc6GEaOjy+EXUFJNLe5Ka2Yl+2E01J63JUnABuazZf/0fIfHUgMr/DSM7NqKBMWPv B4Vc2tlo6Hva6A/YeAGq811qcaNW8HF2FCUUfBtdiaU7nNVivkQMxhTQyG6zrof6RVyKDLO5AdpV 5+Bqo8/EZUHfiiaXYih537IHbE7WB6c4O6LGsRzIvkuJbUY6S3kR2hEE158tu+u7aJxOha2C4qxt /vsRR+ux5Rj1I4zl/Z/egMv6dVYD2jcr3JD1m96RWc7ABz6TOsYVFz99EtG8HMkOYflgTEpkGxwH 8DC7fsdT8ksckgOzZDwK1ynNoQ86GWrEUTk8s6f+q0kpdi5DOt45Am7dOtMRhna9bja6J7xHpowC iTZ1+gb7X5YiMLcb3xo3jb6ZZnduuJblRA1Dsx4vsPw8/A==',
      authnRequestBinding: 'HTTP-POST',
      identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
      passReqToCallback: true
    },
    function(){console.log('Meta')})
    console.log(saml.generateServiceProviderMetadata(publicPem))
  }
}

// Initialize Models
mongoose.loadModels(seedDB);

module.exports.loadModels = function loadModels() {
  mongoose.loadModels();
};

module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config);

  });
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, db, config) {

    // Start the app by listening on <port>
    app.listen(config.port, config.bindIp, function () {

      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
      console.log(chalk.green('Port:\t\t\t\t' + config.port));
      console.log(chalk.green('Database:\t\t\t\t' + config.db.uri));
      if (process.env.NODE_ENV === 'secure') {
        console.log(chalk.green('HTTPs:\t\t\t\ton'));
      }
      console.log(chalk.green('App version:\t\t\t' + config.meanjs.version));
      if (config.meanjs['meanjs-version'])
        console.log(chalk.green('MEAN.JS version:\t\t\t' + config.meanjs['meanjs-version']));
      console.log('--');

      if (callback) callback(app, db, config);
    });

  });

};

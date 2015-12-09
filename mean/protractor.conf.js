'use strict';

// Protractor configuration
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['modules/users/tests/e2e/*.js']
};

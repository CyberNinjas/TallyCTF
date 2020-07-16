'use strict'

module.exports = {
  client: {
    lib: {
      css: [
        'node_modules/@bower_components/bootstrap/dist/css/bootstrap.css',
        'node_modules/@bower_components/bootstrap/dist/css/bootstrap-theme.css',
        'node_modules/@bower_components/angular-bootstrap/ui-bootstrap-csp.js',
        'node_modules/@bower_components/angularjs-slider/dist/rzslider.css',
        'node_modules/@bower_components/sweetalert/dist/sweetalert.css',
        'node_modules/@bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
      ],
      js: [
        'node_modules/@bower_components/api-check/dist/api-check.js',
        'node_modules/@bower_components/jquery/dist/jquery.min.js',
        'node_modules/@bower_components/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/@bower_components/angular/angular.js',
        'node_modules/@bower_components/angular-formly/dist/formly.js',
        'node_modules/@bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
        'node_modules/@bower_components/angularjs-slider/dist/rzslider.js',
        'node_modules/@bower_components/angular-resource/angular-resource.js',
        'node_modules/@bower_components/angular-animate/angular-animate.js',
        'node_modules/@bower_components/angular-messages/angular-messages.js',
        'node_modules/@bower_components/angular-ui-router/release/angular-ui-router.js',
        'node_modules/@bower_components/angular-ui-utils/ui-utils.js',
        'node_modules/@bower_components/angular-file-upload/dist/angular-file-upload.js',
        'node_modules/@bower_components/angular-cache/dist/angular-cache.js',
        'node_modules/@bower_componentsb/q/q.js',
        'node_modules/@bower_components/owasp-password-strength-test/owasp-password-strength-test.js',
        'node_modules/@bower_components/angular-bootstrap/ui-bootstrap.min.js',
        'node_modules/@bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'node_modules/@bower_components/moment/min/moment.min.js',
        'node_modules/@bower_components/sweetalert/dist/sweetalert.min.js',
        'node_modules/@bower_components/ngSweetAlert/SweetAlert.min.js',
        'node_modules/@bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js'
      ],
      tests: ['node_modules/@bower_components/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
}

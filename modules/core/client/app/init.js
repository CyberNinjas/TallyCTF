'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $httpProvider.interceptors.push('authInterceptor');
  }
]);
angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state, Authentication) {
  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if(toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if(Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });
      if(!allowed) {
        event.preventDefault();
        if(Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin');
        }
      }
    }
  });
  $rootScope.$state = $state;
  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    if(!fromState.data || !fromState.data.ignoreState) {
      $state.previous = {
        state: fromState,
        params: fromParams,
        href: $state.href(fromState, fromParams)
      };
    }
  });
}).run(function(formlyConfig) {
  formlyConfig.setType({
    name: 'slider',
    template: ['<rzslider rz-slider-model="model[options.key]"' +
    ' rz-slider-options="to.sliderOptions"></rzslider>'].join(' '),
    wrapper: ['bootstrapLabel', 'bootstrapHasError']
  });

  formlyConfig.setType({
    name: 'multiselect',
    extends: 'select',
    defaultOptions: {
      ngModelAttrs: {
        'true': {
          value: 'multiple'
        }
      }
    }
  })
  formlyConfig.setType({
    name: 'multiInput',
    templateUrl: 'modules/challenges/client/views/answers.template.html',
    defaultOptions: {
      noFormControl: true,
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      templateOptions: {
        inputOptions: {
          wrapper: null
        }
      }
    },
    controller: function($scope) {
      $scope.copyItemOptions = copyItemOptions;
      $scope.correctAnswer = {}

      $scope.toggleCorrect = function(correctAnswer) {
        correctAnswer.correct = !correctAnswer.correct
      }

      $scope.setCorrect = function(correctAnswer) {
        angular.forEach($scope.model.answers, function (answer) {
          answer.correct = false;
        })
        correctAnswer.correct = true;
      }

      function copyItemOptions() {
        return angular.copy($scope.to.inputOptions);
      }
    }
  });

  var unique = 1;
  formlyConfig.setType({
    name: 'repeatSection',
    templateUrl: 'repeatSection.html',
    controller: function($scope) {
      $scope.formOptions = { formState: $scope.formState };
      $scope.copyFields = copyFields;
      function addRandomIds(fields) {
        unique++;
        angular.forEach(fields, function(field, index) {
          if (field.fieldGroup) {
            addRandomIds(field.fieldGroup);
            return;
          }
          if (field.templateOptions && field.templateOptions.fields) {
            addRandomIds(field.templateOptions.fields);
          }
          field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
        });
      }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }

      function copyFields(fields, ceiling) {
        fields = angular.copy(fields);
        addRandomIds(fields);
        return fields;
      }
    }
  });
}).config(function (CacheFactoryProvider) {
  angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });
})

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if(window.location.hash && window.location.hash === '#_=_') {
    if(window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

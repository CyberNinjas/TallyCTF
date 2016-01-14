'use strict';

// User Auths controller
angular.module('userAuths').controller('UserAuthsController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'UserAuths',
  function ($scope, $stateParams, $location, $window, Authentication, UserAuths) {
    $scope.authentication = Authentication;
    $scope.needed = {
      'facebook': false,
      'github': false,
      'google': false,
      'saml': false,
      'linkedin': false,
      'oauth2': true,
      'openidconnect': true
    };

    // Create new User Auth
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userAuthForm');

        return false;
      }

      // Create new User Auth object
      var userAuth = new UserAuths({
        provider: this.provider,
        authType: this.authType,
        authURL: this.authURL,
        userInfoURL: this.userInfoURL,
        callbackURL: '/api/auth/userAuths/' + this.provider.toLowerCase() + '/callback',
        tokenURL: this.tokenURL,
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        scope: this.scope,
        providerImage: this.providerImage,
        updated: Date.now(),
        created: Date.now()
      });

      // Redirect after save
      userAuth.$save(function (response) {
        $location.path('admin/userAuths/' + response._id);

        // Clear form fields
        $scope.provider = '';
        $scope.authType = '';
        $scope.authURL = '';
        $scope.userInfoURL = '';
        $scope.tokenURL = '';
        $scope.clientId = '';
        $scope.clientSecret = '';
        $scope.scope = '';
        $scope.providerImage = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing User Auth
    $scope.remove = function (userAuth) {
      if (userAuth) {
        userAuth.$remove();

        for (var i in $scope.userAuths) {
          if ($scope.userAuths[i] === userAuth) {
            $scope.userAuths.splice(i, 1);
          }
        }
      } else {
        $scope.userAuth.$remove(function () {
          $location.path('admin/userAuths');
        });
      }
    };

    // Update existing User Auth
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userAuthForm');

        return false;
      }

      var userAuth = $scope.userAuth;

      userAuth.$update(function () {
        $location.path('admin/userAuths/' + userAuth._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of User Auths
    $scope.find = function () {
      $scope.userAuths = UserAuths.query();
    };

    // Find existing User Auth
    $scope.findOne = function () {
      $scope.userAuth = UserAuths.get({
        userAuthId: $stateParams.userAuthId
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      url = 'api/auth/userAuths/' + url;
      
      if ($stateParams.previous && $stateParams.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($stateParams.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

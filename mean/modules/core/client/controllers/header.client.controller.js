'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$interval','$state', 'Authentication', 'Menus','Users','Teams',
  function ($scope, $interval, $state, Authentication, Menus, Users, Teams) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.user = Users;
    $scope.team = Teams;
    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    $scope.signout = function () {
      window.location="/api/auth/signout";
    };
    $scope.removeNotifications = function() {
      var user = new Users($scope.authentication);

      user.notifications = 0;
      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
    $scope.callAtInterval = function(){
      $scope.mnotify = Authentication.user.notifications;
      //$scope.team = Teams.query();
      console.log($scope.mnotify);
     // console.log("interval");
    };

    $interval(function(){$scope.callAtInterval();}, 5000);
  }
]);



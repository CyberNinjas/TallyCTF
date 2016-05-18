'use strict';

angular.module('core')
  .controller('HeaderController', ['$scope', '$interval', '$state', 'Authentication', 'Menus', 'Users', 'Socket',
    function($scope, $interval, $state, Authentication, Menus, Users, Socket) {
      // Expose view variables
      $scope.$state = $state;
      $scope.authentication = Authentication;
      $scope.user = Users;
      // Get the topbar menu
      $scope.menu = Menus.getMenu('topbar');

      // Setup messaging system
      if(!Socket.socket) {
        Socket.connect();
      }

      // Setup Listener for updating the authenticated user
      Socket.on('userUpdate', function(message) {
        if(message.recipients.indexOf('*') === -1 &&
          (!Authentication.user || message.recipients.indexOf(Authentication.user._id) === -1)) {
          return;
        }

        switch(message.op) {
          case 'newConnection':
            break;
            // Remove the user from its team
          case 'notify':
            Authentication.user.notifications++;
            break;
          case 'insert':
            if(message.field)
              Authentication.user[message.field].push(message.data);
            break;
          case 'remove':
            if(Authentication.user[message.field].indexOf(message.data) !== -1) {
              Authentication.user[message.field].splice(
                Authentication.user[message.field].indexOf(message.data), 1
              );
            }
            break;
          case 'insertTeam':
            if(Authentication.user && Authentication.user.roles) {
              Authentication.user.roles.push('teamMember');
              Authentication.user.team = message.data;
            }
            break;
          case 'rmTeam':
            delete Authentication.user.team;
            if(Authentication.user.roles.indexOf('teamMember') !== -1)
              Authentication.user.roles.splice(Authentication.user.roles.indexOf('teamMember'), 1);
            if(Authentication.user.roles.indexOf('teamCaptain') !== -1)
              Authentication.user.roles.splice(Authentication.user.roles.indexOf('teamCaptain'), 1);
            break;
          default:
            console.log('Socket: Don\'t know what to do with: ');
            console.log(message);
            break;
        }
      });

      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function() {
        Socket.removeListener('userUpdate');
      });

      // Toggle the menu items
      $scope.isCollapsed = false;
      $scope.toggleCollapsibleMenu = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
      };

      // Collapsing the menu after navigation
      $scope.$on('$stateChangeSuccess', function() {
        $scope.isCollapsed = false;
      });

      $scope.signout = function() {
        window.location = '/api/auth/signout';
      };
    }
  ]);

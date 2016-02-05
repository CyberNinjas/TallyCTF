'use strict';
/**
 * @ngdoc directive
 * @name ngIfPermissionOr
 * @restrict A
 *
 * @description This directive checks all tags for the ng-if-role-or attribute, and if present the current user
 *              must have one of the roles listed within the tag in order for the tag to display. When it doesn't
 *              display it behaves like ngIf, where the tag is actually completely removed from the page.
 **/
angular.module('core')
.directive('ngIfRoleOr', function ($animate, AuthorizeService) {
  return {
    multiElement: true,
    transclude: 'element',
    priority: -1,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: function ($scope, $element, $attr, ctrl, $transclude) {
      var block, childScope, previousElements;
      $attr.$observe('ngIfRoleOr', function (value) {
        var roles = false;
        try {
          roles = JSON.parse(value.replace(/'/g, '"'))
        } catch (e) {
        }
        ;//Throw away invalid JSON
        AuthorizeService.isAuthorizedForOne(roles).then(function (auth) {
          if (!childScope) {
            $transclude(
            function (clone, newScope) {
              childScope = newScope;
              clone[clone.length + 1] = document.createComment(' end ngIfRoleOr: ' + $attr.ngIfRoleOr + ' ');
              // Note: We only need the first/last node of the cloned nodes.
              // However, we need to keep the reference to the jqlite wrapper as it might be changed later
              // by a directive with templateUrl when its template arrives.
              block = {
                clone: clone
              };
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        },
        function (err) {
          if (previousElements) {
            previousElements.remove();
            previousElements = null;
          }
          if (childScope) {
            childScope.$destroy();
            childScope = null;
          }
          if (block) {
            previousElements = getBlockNodes(block.clone);
            $animate.leave(previousElements).then(function () {
              previousElements = null;
            });
            block = null;
          }
        });
      });
    }
  };
});

'use strict';
/**
 * @ngdoc directive
 * @name ngIfRoleAnd
 * @restrict A
 *
 * @description This directive checks all tags for the ng-if-role-and attribute, and if present the current user
 *              must have all the roles listed within the tag in order for the tag to display. When it doesn't
 *              display it behaves like ngIf, where the tag is actually completely removed from the page.
 **/
angular.module('core')
.directive('ngIfRoleAnd', function ($animate, AuthorizeService) {
  return {
    multiElement: true,
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: function ($scope, $element, $attr, ctrl, $transclude) {
      var block, childScope, previousElements;
      $attr.$observe('ngIfRoleAnd', function (value) {
        var roles = JSON.parse(value.replace(/'/g, '"'));
        AuthorizeService.isAuthorizedForAll(roles).then(function (auth) {
          if (!childScope) {
            $transclude(
            function (clone, newScope) {
              childScope = newScope;
              clone[clone.length + 1] = document.createComment(' end ngIfRoleAnd: ' + $attr.ngIfRoleAnd + ' ');
              // Note: We only need the first/last node of the cloned nodes.
              // However, we need to keep the reference to the jqlite wrapper as it might be changed later
              // by a directive with templateUrl when its template arrives.
              block = {
                clone: clone
              };
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        },
        function (err) {
          if (previousElements) {
            previousElements.remove();
            previousElements = null;
          }
          if (childScope) {
            childScope.$destroy();
            childScope = null;
          }
          if (block) {
            previousElements = getBlockNodes(block.clone);
            $animate.leave(previousElements).then(function () {
              previousElements = null;
            });
            block = null;
          }
        });
      });
    }
  };
});


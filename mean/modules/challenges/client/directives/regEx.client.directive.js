'use strict';

// Directive for the RegEx buttons
angular.module('challenges').directive('regEx', function () {
  return {
    link: function (scope, element, attrs) {
      // Allows for this directive to apply itself if true is passed
      scope.$watch(attrs.regEx, function (value) {
        if (value) {
          var prop = element.prop('class');
          element.prop('class', prop + ' active');
        }
      });

      // Toggles view on click
      element.on('click', function (event) {
      	event.preventDefault();
      	var prop = element.prop('class');
      	var index = prop.search(' active');

      	if (index !== -1)
      	  prop = prop.slice(0, index);
      	else
      	  prop = prop + ' active';

        element.prop('class', prop);
      });
    }
  };
});

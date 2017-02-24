'use strict';

angular.module('ctfEvents').directive('datetime', function () {
  // Needed to tell JSHint about the external $ (jquery)
  /* globals $ */
  return {
    link: function (scope, elem, attrs) {
      $(function () {
        $(elem).datetimepicker({
          format: 'YYYY-MM-DD HH:mm:ss'
        });

        // Need to tell angular that date has changed when element is unselected
        // (The datetime picker doesn't do this by default)
        $(elem).blur(function () {
          $(elem).change();
        });
      });
    }
  };
});

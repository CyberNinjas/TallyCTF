'use strict';

angular.module('ctfEvents').directive('bcollapse', function () {
  // Needed to tell JSHint about the external $ (jquery)
  /* globals $ */
  return {
    link: function (scope, elem, attrs) {
      $(elem).on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.collapse-group').find('.collapse');
        $collapse.collapse('toggle');
      });
    }
  };
});

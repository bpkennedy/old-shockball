'use strict';

/**
 * @ngdoc directive
 * @name shockballApp.directive:tooltip
 * @description
 * # tooltip
 */
angular.module('shockballApp')
  .directive('tooltip', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
          element
            .addClass('tooltip-wrap')
            .append(angular.element('<div class="tooltip-text">'+attrs.title+'</div>'))
            .attr('title', null);
      }
    };
  });

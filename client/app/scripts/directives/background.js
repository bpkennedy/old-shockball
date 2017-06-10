'use strict';

/**
* @ngdoc directive
* @name shockballApp.directive:background
* @description
* # background
*/
angular.module('shockballApp')
.directive('background', function (backgroundSvc) {
    return {
        restrict: 'A',
        link: function postLink(scope, element) {
            var lastClass = '';

            scope.$on('background:updated', function() {
                setBgClass();
            });

            function init() {
                lastClass = backgroundSvc.getCurrentBg();
            }

            function setBgClass() {
                element.removeAttr('class');
                element.addClass(backgroundSvc.getCurrentBg());
            }

            init();
        }
    };
});

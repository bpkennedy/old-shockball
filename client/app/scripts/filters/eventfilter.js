'use strict';

/**
 * @ngdoc filter
 * @name shockballApp.filter:eventFilter
 * @function
 * @description
 * # eventFilter
 * Filter in the shockballApp.
 */
angular.module('shockballApp')
.filter('eventFilter', function () {
    return function (eventType) {
        var eventClassTypes = {
            hit: 'hit',
            contract: 'contract',
            score: 'score',
            injury: 'injury',
            foul: 'foul',
            train: 'train',
            miss: 'miss',
            block: 'block'
        };
        var className = eventClassTypes[eventType] ? eventClassTypes[eventType] : 'generic';
        return className;
    };
});

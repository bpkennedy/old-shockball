'use strict';

/**
* @ngdoc service
* @name shockballApp.backgroundSvc
* @description
* # backgroundSvc
* Factory in the shockballApp.
*/
angular.module('shockballApp')
.factory('backgroundSvc', function ($rootScope) {
    var data = {
        className: 'home-bg'
    };

    function setCurrentBg(className) {
        data.className = className;
        $rootScope.$broadcast('background:updated', className);
    }

    function getCurrentBg() {
        return data.className;
    }

    return {
        setCurrentBg: setCurrentBg,
        getCurrentBg: getCurrentBg
    };

});

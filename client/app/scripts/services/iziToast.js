'use strict';

/**
* @ngdoc service
* @name shockballApp.iziToast
* @description
* # iziToast
* Factory in the shockballApp.
*/
angular.module('shockballApp')
.factory('iziToast', function ($window) {

    function init() {
        $window.iziToast.settings({
            timeout: 10000,
            resetOnHover: true,
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            onOpen: function(){
                // console.log('callback abriu!');
            },
            onClose: function(){
                // console.log("callback fechou!");
            }
        });
    }

    return {
        init: init
    };
});

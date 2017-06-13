'use strict';

/**
* @ngdoc service
* @name shockballApp.Presence
* @description
* # Presence
* Factory in the shockballApp.
*/
angular.module('shockballApp')
.factory('presence', function ($window, $http, utils, $rootScope) {

    function init() {
        setPresence();
    }

    function setPresence() {
        var presence = $window.firebase.database().ref('presence/app');
        presence.on('value', function(snapshot) {
            if (snapshot.val() === true) {
                $rootScope.$broadcast('presence:app true');
            } else {
                $rootScope.$broadcast('presence:app false');
            }
        });
    }

    return {
        init: init
    };
});

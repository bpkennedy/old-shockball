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
        var presence = $window.firebase.database().ref('presence');
        console.log(presence);
        presence.on('value', function(snapshot) {
            if (snapshot.val() === true) {
                console.log('is true');
                $rootScope.$broadcast('presence:app true');
            } else {
                console.log('is false');
                $rootScope.$broadcast('presence:app false');
            }
        });
      }

      return {
        init: init
      };
  });

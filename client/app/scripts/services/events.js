'use strict';

/**
* @ngdoc service
* @name shockballApp.Events
* @description
* # Events
* Factory in the shockballApp.
*/
angular.module('shockballApp')
.factory('Events', function ($window, Data) {

    function create(data) {
        var eventToSend = {};
        if (data.type && data.actor) {
            eventToSend.actor = data.actor;
            eventToSend.oppActor = data.oppActor || null;
            eventToSend.secondaryOppActor = data.secondaryOppActor || null;
            eventToSend.type = data.type;
            eventToSend.intensity = data.intensity || null;
            eventToSend.match = data.match || null;
            eventToSend.team = data.team || null;
            eventToSend.oppTeam = data.oppTeam || null;
            eventToSend.time = new Date().toJSON();
            return Data.postMessage(eventToSend);
        } else {
            $window.iziToast.error({
                icon: 'fa fa-warning',
                message: 'Error: at minimum, events require a type and actor'
            });
            return;
        }
    }


    return {
        create: create
    };
});

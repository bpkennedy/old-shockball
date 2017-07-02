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
            //contract fields
            if (data.type.indexOf('contract:') > -1) {
                eventToSend.endDate = data.endDate || null;
                eventToSend.startDate = data.startDate || null;
                eventToSend.goalBonus1 = data.goalBonus1.toString() || null;
                eventToSend.goalBonus2 = data.goalBonus2.toString() || null;
                eventToSend.goalBonus3 = data.goalBonus3.toString() || null;
                eventToSend.offerTeam = data.offerTeam || null;
                eventToSend.signingPlayer = data.signingPlayer || null;
                eventToSend.salary = data.salary.toString() || null;
                eventToSend.status = data.teamLockIn && data.playerLockIn ? 'active': 'pending';
                eventToSend.teamLockIn = data.teamLockIn || null;
                eventToSend.playerLockIn = data.playerLockIn || null;
                eventToSend.contractUid = data.contractUid || null;
            }
            //captain fields
            if (data.type.indexOf('captain') > -1) {
                eventToSend.captainUid = data.captainUid;
            }
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

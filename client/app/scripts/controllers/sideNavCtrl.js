'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:SideNavCtrl
* @description
* # SideNavCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('SideNavCtrl', function () {
    var sideNav = this;
    console.log(sideNav);
    sideNav.userObj = {
        first_name: 'Tholme',
        last_name: 'So',
        current_team: 'Kenbo Spankers',
        stats: {
            speed: '70',
            tackle: '25',
            stamina: '60',
            shooting: '85',
            passing: '20',
            defending: '10'
        },
        current_training: 'speed',
        current_strategy: 'scoring',
        birth_planet: 'Tatooine',
        profile_pic: 'http://i736.photobucket.com/albums/xx4/bpkennedy/norringtonfreelance.jpg',
        isCaptain: false,
        isOwner: false,
        current_team_id: 4,
        items: [ 6, 14, 29 ]
    };
});

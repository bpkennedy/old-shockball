'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:TeamCtrl
* @description
* # TeamCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp').controller('TeamCtrl', function ($state, $stateParams, Data) {
    var vm = this;
    vm.teamId = $stateParams.teamId;
    vm.teamData = {};
    vm.teamPlayersData = [];

    function init() {
        setTeamModel(vm.teamId);
        setPlayersModel(vm.teamId);
    }

    function setTeamModel(id) {
        Data.fetchTeam(id).then(function(response) {
            vm.teamData = response.data;
        });
    }

    function setPlayersModel(id) {
        Data.fetchTeamPlayers(id).then(function(response) {
            vm.teamPlayersData = response.data;
        });
    }

    init();

});

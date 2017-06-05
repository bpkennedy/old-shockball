'use strict';

/**
 * @ngdoc function
 * @name shockballApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the shockballApp
 */
angular.module('shockballApp')
  .controller('PlayerCtrl', function ($stateParams, Data) {
      var vm = this;
      vm.playerId = $stateParams.playerId;
      vm.playerData = {};
      vm.teamData = {};
      vm.contractData = {};
      vm.matchesData = [];
      vm.eventsData = [];

      function init() {
          setPlayerModel(vm.playerId);
      }

      function setPlayerModel(id) {
          Data.fetchPlayer(id).then(function(response) {
             vm.playerData = response.data;
             if (vm.playerData.team) {
                 setTeamModel(vm.playerData.team);
                 setMatchesModel(vm.playerData.team);
                 setContractModel(vm.playerId);
                 setEventsModel(vm.playerId);
             }
            //  console.log(vm.playerData);
          });
      }

      function setTeamModel(teamId) {
          Data.fetchTeam(teamId).then(function(response) {
             vm.teamData = response.data;
            //  console.log(vm.teamData);
          });
      }

      function setContractModel(id) {
          Data.fetchPlayerContract(id).then(function(response) {
             vm.contractData = response.data[Object.keys(response.data)[0]];
            //  console.log(vm.contractData);
          });
      }

      function setMatchesModel(teamId) {
          Data.fetchHomeMatches(teamId).then(function(homeResponse) {
              if (homeResponse) {
                  _.forEach(homeResponse, function(value, key) {
                     vm.matchesData.push(value);
                  });
              }
             Data.fetchAwayMatches(teamId).then(function(awayResponse) {
                 if (awayResponse) {
                     _.forEach(awayResponse, function(value, key) {
                        vm.matchesData.push(value);
                     });
                    //  console.log(vm.matchesData);
                 }
             });
          });
      }

      function setEventsModel(playerId) {
          Data.fetchPrimaryEvents(playerId).then(function(primaryResponse) {
             if (primaryResponse) {
                 _.forEach(primaryResponse, function(value, key) {
                    vm.eventsData.push(value);
                 });
             }
             Data.fetchSecondaryEvents(playerId).then(function(secondaryResponse) {
                 if (secondaryResponse) {
                     _.forEach(secondaryResponse, function(value, key) {
                        vm.eventsData.push(value);
                     });
                 }
                 console.log(vm.eventsData);
             });
          });
      }

      init();
  });

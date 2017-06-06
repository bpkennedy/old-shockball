'use strict';

/**
 * @ngdoc function
 * @name shockballApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the shockballApp
 */
angular.module('shockballApp')
  .controller('PlayerCtrl', function ($stateParams, Data, backgroundSvc) {
      var vm = this;
      vm.playerId = $stateParams.playerId;
      vm.playerData = {};
      vm.teamData = {};
      vm.contractData = {};
      vm.matchesData = [];
      vm.eventsData = [];
    //   vm.columnDefs = [];
    //   vm.rowData = [];
    //   vm.gridOptions = {
    //       columnDefs: vm.columnDefs,
    //       rowData: vm.rowData
    //   };

      vm.calculateTimeRemaining = calculateTimeRemaining;

      vm.columnDefs = [
          {headerName: "Make", field: "make"},
          {headerName: "Model", field: "model"},
          {headerName: "Price", field: "price"}
      ];

      vm.rowData = [
          {make: "Toyota", model: "Celica", price: 35000},
          {make: "Ford", model: "Mondeo", price: 32000},
          {make: "Porsche", model: "Boxter", price: 72000}
      ];

      vm.gridOptions = {
          columnDefs: vm.columnDefs,
          rowData: vm.rowData
      };

      function init() {
          backgroundSvc.setCurrentBg('player-bg');
          setPlayerModel(vm.playerId);
      }

      function setPlayerModel(id) {
          Data.fetchPlayer(id).then(function(response) {
             vm.playerData = response.data;
             sortPlayerSkills(vm.playerData);
             console.log(vm.playerData);
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
          });
      }

      function setContractModel(id) {
          Data.fetchPlayerContract(id).then(function(response) {
             vm.contractData = response.data[Object.keys(response.data)[0]];
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
             });
          });
      }

      function sortPlayerSkills(playerData) {
          if (playerData) {
              vm.playerData.skills = {};
              vm.playerData.graphLabels = [];
              _.forEach(playerData, function(value, key) {
                  if (key.indexOf('skill') > -1) {
                      key = key.split('skill').pop();
                    //   vm.playerData.skills.push(angular.copy(object));
                      vm.playerData.graphLabels.push(key);
                      vm.playerData.skills[key] = value;
                  }
              });
              vm.playerData.graphValues = [ _.values(vm.playerData.skills) ];
          }
      }

      function calculateTimeRemaining(endDate) {
          var timeRemaining = moment().countdown(endDate, countdown.WEEKS, NaN).toString();
          return '(' + timeRemaining + ' left)';
      }

      init();
  });

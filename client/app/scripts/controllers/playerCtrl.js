'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:PlayerCtrl
* @description
* # PlayerCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('PlayerCtrl', function ($scope, $stateParams, Data, backgroundSvc) {
    var vm = this;
    vm.playerId = $stateParams.playerId;
    vm.playerData = {};
    vm.teamData = {};
    vm.contractData = {};
    vm.matchesData = [];
    vm.eventsData = [];
    vm.showEvents = false;
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
    //   vm.columnDefs = [];
    //   vm.rowData = [];
    //   vm.gridOptions = {
    //       columnDefs: vm.columnDefs,
    //       rowData: vm.rowData
    //   };

    vm.calculateTimeRemaining = calculateTimeRemaining;
    vm.loadMatches = loadMatches;
    vm.loadEvents = loadEvents;

    vm.gridOptions = {
        columnDefs: vm.columnDefs,
        rowData: vm.rowData,
        onGridReady: function(event) {
            console.log(event);
            vm.gridOptions.api.setRowData(vm.rowData);
        }
    };

    function init() {
        backgroundSvc.setCurrentBg('player-bg');
        setPlayerModel(vm.playerId);
    }

    function setPlayerModel(id) {
        Data.fetchPlayer(id).then(function(response) {
            vm.playerData = response.data;
            sortPlayerSkills(vm.playerData);
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
                vm.matchesData = _.uniqBy(vm.matchesData, 'objectKey');
            });
        });
    }

    function setEventsModel(playerId) {
        Data.fetchPrimaryEvents(playerId).then(function(primaryResponse) {
            if (primaryResponse) {
                _.forEach(primaryResponse, function(value, key) {
                    vm.eventsData.push(value);
                });
                console.log(vm.eventsData);
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

    function loadMatches() {
        vm.showEvents = false;
        vm.columnDefs = [
            {headerName: "Home Team", field: "homeTeam"},
            {headerName: "Away Team", field: "awayTeam"}
        ];
        vm.rowData = [];
        _.forEach(vm.matchesData, function(value, key) {
            var rowDataItem = {};
            rowDataItem.homeTeam = value.homeTeamName;
            rowDataItem.awayTeam = value.awayTeamName;
            vm.rowData.push(rowDataItem);
        });
        updateGrid();
    }

    function loadEvents() {
        vm.showEvents = true;
    }

    function updateGrid() {
        vm.gridOptions.api.setRowData(vm.rowData);
        vm.gridOptions.api.setColumnDefs(vm.columnDefs);
        vm.gridOptions.api.refreshView();
    }

    function sortPlayerSkills(playerData) {
        var data = angular.copy(playerData);
        if (data) {
            vm.playerData.skills = {};
            vm.playerData.scndSkills = {};
            vm.playerData.skillLabels = [];
            vm.playerData.scndSkillLabels = [];
            _.forEach(data, function(value, key) {
                if (key.indexOf('skill') > -1) {
                    key = key.split('skill').pop();
                    if (key === 'Toughness' || key === 'Aggro' || key === 'Endurance' || key === 'Leadership') {
                        vm.playerData.scndSkillLabels.push(key);
                        vm.playerData.scndSkills[key] = value;
                    } else {
                        vm.playerData.skillLabels.push(key);
                        vm.playerData.skills[key] = value;
                    }
                }
            });
            vm.playerData.skills = [ _.values(vm.playerData.skills) ];
            vm.playerData.scndSkills = [ _.values(vm.playerData.scndSkills)];
        }
    }

    function calculateTimeRemaining(endDate) {
        var timeRemaining = moment().countdown(endDate, countdown.WEEKS, NaN).toString();
        return '(' + timeRemaining + ' left)';
    }

    init();
});

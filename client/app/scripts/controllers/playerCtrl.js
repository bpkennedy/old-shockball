'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:PlayerCtrl
* @description
* # PlayerCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('PlayerCtrl', function ($http, $scope, $state, $stateParams, Data, $window) {
    var vm = this;
    vm.playerId = $stateParams.playerId ? $stateParams.playerId : $window.firebase.auth().currentUser.uid;
    vm.playerData = {};
    vm.teamData = {};
    vm.contractData = {};
    vm.matchesData = [];
    vm.eventsData = [];
    vm.showEvents = false;

    vm.calculateTimeRemaining = calculateTimeRemaining;
    vm.loadMatches = loadMatches;
    vm.loadEvents = loadEvents;

    function init() {
        setPlayerModel(vm.playerId);
    }

    function setPlayerModel(id) {
        Data.fetchPlayer(id).then(function(response) {
            if (response.data === "") {
                //player does not exist in players collection, needs to create
                $state.go('root.playerCreate');
            }
            vm.playerData = response.data;
            sortPlayerSkills(vm.playerData);
            if (vm.playerData.team) {
                setTeamModel(vm.playerData.team);
                setMatchesModel(vm.playerData.team);
                setContractModel(vm.playerId);
                setEventsModel(vm.playerId);
            }
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
                _.forEach(homeResponse, function(value) {
                    vm.matchesData.push(value);
                });
            }
            Data.fetchAwayMatches(teamId).then(function(awayResponse) {
                if (awayResponse) {
                    _.forEach(awayResponse, function(value) {
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
                _.forEach(primaryResponse, function(value) {
                    vm.eventsData.push(value);
                });
                console.log(vm.eventsData);
            }
            Data.fetchSecondaryEvents(playerId).then(function(secondaryResponse) {
                if (secondaryResponse) {
                    _.forEach(secondaryResponse, function(value) {
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
        _.forEach(vm.matchesData, function(value) {
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

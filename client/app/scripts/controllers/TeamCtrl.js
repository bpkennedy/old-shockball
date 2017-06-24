'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:TeamCtrl
* @description
* # TeamCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp').controller('TeamCtrl', function ($scope, $state, $stateParams, Data, utils) {
    var vm = this;
    vm.teamId = $stateParams.teamId;
    vm.showPlayers = true;
    vm.showStats = false;
    vm.showActivities = false;
    vm.showContracts = false;
    vm.showMatches = false;
    vm.teamData = {};
    vm.teamPlayersData = [];
    vm.showPanel = showPanel;
    vm.teamPlayersDefs = [
        {headerName: "Name", field: "name", cellRenderer: playerNameCellRender},
        {headerName: "Role", field: "role"},
        {headerName: "XP", field: "xp"},
        {headerName: "Throwing", field: "throwing"},
        {headerName: "Passing", field: "passing"},
        {headerName: "Blocking", field: "blocking"},
        {headerName: "Endurance", field: "endurance"},
        {headerName: "Toughness", field: "toughness"},
        {headerName: "Leadership", field: "leadership"},
        {headerName: "Morale", field: "morale"},
        {headerName: "Fatigue", field: "fatigue"},
        {headerName: "Aggression", field: "aggro"},
        {headerName: "Age", field: "age"}
    ];
    vm.teamPlayersData = [];
    vm.gridOptions = {
        columnDefs: vm.teamPlayersDefs,
        rowData: vm.teamPlayersData,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        enableColResize: true,
        onGridReady: function(event) {
            console.log(event);
            updateGrid();
        },
    };
    $scope.goToPlayer = goToPlayer;

    function init() {
        setTeamModel(vm.teamId);
        setPlayersModel(vm.teamId);
    }

    function playerNameCellRender(params) {
        params.$scope.goToPlayer = goToPlayer;
        return "<a class=\"team-link\" ng-click=\"goToPlayer(data.uid)\">" + params.data.fullName + "</a>";
    }

    function goToPlayer(id) {
        $state.go('root.player', { playerId: id });
    }

    function showPanel(panel) {
        if (panel === 'players') {
            vm.showPlayers = true;
            vm.showStats = false;
            vm.showActivities = false;
            vm.showContracts = false;
            vm.showMatches = false;
        } else if (panel === 'stats') {
            vm.showPlayers = false;
            vm.showStats = true;
            vm.showActivities = false;
            vm.showContracts = false;
            vm.showMatches = false;
        } else if (panel === 'activities') {
            vm.showPlayers = false;
            vm.showStats = false;
            vm.showActivities = true;
            vm.showContracts = false;
            vm.showMatches = false;
        } else if (panel === 'contracts') {
            vm.showPlayers = false;
            vm.showStats = false;
            vm.showActivities = false;
            vm.showContracts = true;
            vm.showMatches = false;
        } else if (panel === 'matches') {
            vm.showPlayers = false;
            vm.showStats = false;
            vm.showActivities = false;
            vm.showContracts = false;
            vm.showMatches = true;
        }
    }


    function setTeamModel(id) {
        Data.fetchTeam(id).then(function(response) {
            vm.teamData = response.data;
        });
    }

    function setPlayersModel(id) {
        Data.fetchTeamPlayers(id).then(function(response) {
            var playersWithFullNames = constructFullNames(response.data);
            vm.teamPlayersData = utils.unpackObjectKeys(playersWithFullNames);
            updateGrid();
        });
    }

    function updateGrid() {
        if (vm.gridOptions.api) {
            vm.gridOptions.api.setRowData(vm.teamPlayersData);
            vm.gridOptions.api.sizeColumnsToFit();
        }
    }

    function constructFullNames(players) {
        _.forEach(players, function(player) {
            player.fullName = player.firstName + ' ' + player.lastName;
        });
        return players;
    }

    init();

});

'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:LeagueCtrl
* @description
* # LeagueCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('LeagueCtrl', function ($scope, $state, Data, utils) {
    var vm = this;
    vm.leagueTeamsDefs = [
        {headerName: "Team", field: "name", cellRenderer: teamNameCellRender},
        {headerName: "Logo", field: "picUrl"},
        {headerName: "Division", field: "division"},
        {headerName: "Object Key", field: "objectKey"},
        {headerName: "UID", field: "uid"}
    ];
    vm.leaguePlayersDefs = [
        {headerName: "Player", field: "playerFullName", cellRenderer: playerNameCellRender},
        {headerName: "Team", field: "teamName", cellRenderer: playerTeamNameCellRender},
        {headerName: "Role", field: "role"},
        {headerName: "XP", field: "xp"},
        {headerName: "Th", field: "throwing"},
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
    vm.freeAgentPlayersDefs = [
        {headerName: "Player", field: "playerFullName", cellRenderer: playerNameCellRender},
        {headerName: "Role", field: "role"},
        {headerName: "XP", field: "xp"},
        {headerName: "Th", field: "throwing"},
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
    vm.divisions = [];
    vm.conferences = [];
    vm.leagueTeams = [];
    vm.leaguePlayers = [];
    vm.freeAgentPlayers = [];
    vm.divisionTeams = [];
    vm.conferenceTeams = [];
    vm.selectedConf = { value: vm.conferences[0] };
    vm.selectedDiv = { value: vm.divisions[0] };
    vm.setConference = setConference;
    vm.setDivision = setDivision;
    vm.showPanel = showPanel;
    vm.showTeams = true;
    vm.showPlayers = false;
    vm.showFreeAgents = false;

    vm.gridLeagueTeamsOptions = {
        columnDefs: vm.leagueTeamsDefs,
        rowData: vm.leagueTeams,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        enableColResize: true,
        onGridReady: function(event) {
            console.log(event);
            updateLeagueTeamsGrid();
        },
    };
    vm.gridLeaguePlayersOptions = {
        columnDefs: vm.leaguePlayersDefs,
        rowData: vm.leaguePlayers,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        enableColResize: true,
        onGridReady: function(event) {
            console.log(event);
            updateLeaguePlayersGrid();
        },
    };
    vm.gridFreeAgentPlayersOptions = {
        columnDefs: vm.freeAgentPlayersDefs,
        rowData: vm.freeAgentPlayers,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        enableColResize: true,
        onGridReady: function(event) {
            console.log(event);
            updateFreeAgentPlayersGrid();
        },
    };
    $scope.goToPlayer = goToPlayer;
    $scope.goToTeam = goToTeam;

    function init() {
        setLeagueModel();
        getConferences();
    }

    function showPanel(panel) {
        if (panel === 'teams') {
            vm.showTeams = true;
            vm.showPlayers = false;
            vm.showFreeAgents = false;
        } else if (panel === 'players') {
            vm.showTeams = false;
            vm.showPlayers = true;
            vm.showFreeAgents = false;
        } else if (panel === 'free agents') {
            vm.showTeams = false;
            vm.showPlayers = false;
            vm.showFreeAgents = true;
        }
    }

    function getConferences() {
        Data.fetchConferences().then(function(response) {
            vm.conferences = utils.unpackObjectKeys(response.data);
            vm.selectedConf = { value: vm.conferences[0].name };
        });
    }

    function setDivision(value) {
        Data.fetchDivisionTeams(value.objectKey).then(function(response) {
            vm.leagueTeams =  utils.unpackObjectKeys(response.data);
            updateLeagueTeamsGrid();
        });
    }

    function setConference(value) {
        var conferenceDivisions = [];
        var divisionTeams = [];
        var conferenceTeams = [];
        var counter = 0;
        var divisionCount = 0;
        Data.fetchConferenceDivisions(value.objectKey).then(function(response) {
            conferenceDivisions = utils.unpackObjectKeys(response.data);
            vm.divisions = conferenceDivisions;
            vm.selectedDiv = { value: vm.divisions[0] };
            divisionCount = conferenceDivisions.length;
            _.forEach(conferenceDivisions, function(division) {
                Data.fetchDivisionTeams(division.objectKey).then(function(response) {
                    counter++;
                    divisionTeams = utils.unpackObjectKeys(response.data);
                    _.forEach(divisionTeams, function(team) {
                        conferenceTeams.push(team);
                    });
                    if (counter === divisionCount) {
                        vm.leagueTeams = conferenceTeams;
                        updateLeagueTeamsGrid();
                    }
                });
            });

        });
    }

    function setLeagueModel() {
        Data.fetchAllTeams().then(function(response) {
            vm.leagueTeams = response.data;
            updateLeagueTeamsGrid();
            Data.fetchAllPlayers().then(function(response) {
                var populatedPlayers = populatePlayerFullNames(response.data);
                vm.leaguePlayers = filterLeaguePlayers(populatedPlayers);
                vm.freeAgentPlayers = filterFreeAgents(populatedPlayers);
                updateLeaguePlayersGrid();
                updateFreeAgentPlayersGrid();
            });
        });
    }

    function filterLeaguePlayers(allPlayers) {
        var leagueTeams = vm.leagueTeams;
        var leaguePlayers = _.filter(allPlayers, function(player) {
            return player.team;
        });
        _.forEach(leaguePlayers, function(player) {
            var matchedTeam = _.find(leagueTeams, function(team) {
                return team.uid === player.team;
            });
            player.teamName = matchedTeam.name;
        });
        return leaguePlayers;
    }

    function filterFreeAgents(allPlayers) {
        var freeAgents = _.filter(allPlayers, function(player) {
            return !player.team;
        });
        return freeAgents;
    }

    function populatePlayerFullNames(allPlayers) {
        _.forEach(allPlayers, function(player) {
            player.playerFullName = player.firstName + ' ' + player.lastName;
        });
        return allPlayers;
    }

    function teamNameCellRender(params) {
        params.$scope.goToTeam = goToTeam;
        return "<a class=\"team-link\" ng-click=\"goToTeam(data.uid)\">" + params.data.name + "</a>";
    }

    function playerNameCellRender(params) {
        params.$scope.goToPlayer = goToPlayer;
        return "<a class=\"team-link\" ng-click=\"goToPlayer(data.uid)\">" + params.data.playerFullName + "</a>";
    }

    function playerTeamNameCellRender(params) {
        params.$scope.goToTeam = goToTeam;
        return "<a class=\"team-link\" ng-click=\"goToTeam(data.team)\">" + params.data.teamName + "</a>";
    }

    function goToTeam(id) {
        $state.go('root.team', { teamId: id });
    }

    function goToPlayer(id) {
        $state.go('root.player', { playerId: id });
    }

    function updateLeagueTeamsGrid() {
        if (vm.gridLeagueTeamsOptions.api) {
            vm.gridLeagueTeamsOptions.api.setRowData(vm.leagueTeams);
            vm.gridLeagueTeamsOptions.api.sizeColumnsToFit();
        }
    }

    function updateLeaguePlayersGrid() {
        if (vm.gridLeaguePlayersOptions.api) {
            vm.gridLeaguePlayersOptions.api.setRowData(vm.leaguePlayers);
            vm.gridLeaguePlayersOptions.api.sizeColumnsToFit();
        }
    }

    function updateFreeAgentPlayersGrid() {
        if (vm.gridFreeAgentPlayersOptions.api) {
            vm.gridFreeAgentPlayersOptions.api.setRowData(vm.freeAgentPlayers);
            vm.gridFreeAgentPlayersOptions.api.sizeColumnsToFit();
        }
    }

    init();
});

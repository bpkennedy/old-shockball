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
    vm.isContractCreateMode = false;

    vm.showPlayers = true;
    vm.showStats = false;
    vm.showActivities = false;
    vm.showContracts = false;
    vm.showMatches = false;
    vm.showPanel = showPanel;

    vm.teamData = {};
    vm.teamActiveContractsData = [];
    vm.teamPendingContractsData = [];
    vm.teamPlayersData = [];
    vm.allTeams = [];
    vm.allPlayers = [];
    vm.teamPlayersDefs = [
        {headerName: "Name", field: "name", cellRenderer: playerNameCellRender},
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
    vm.teamActiveContractsDefs = [
        {headerName: "Player", field: "playerFullName", cellRenderer: playerNameCellRender},
        {headerName: "Status", field: "status"},
        {headerName: "Started", field: "startDate", cellRenderer: convertStartDate},
        {headerName: "Expires in", field: "endDate", cellRenderer: convertEndDate},
        {headerName: "Salary", field: "salary", cellRenderer: convertSalaryToCredits},
        {headerName: "Goal Bonus", field: "goalBonus", cellRenderer: convertGoalBonusToCredits}
    ];
    vm.teamPendingContractsDefs = [
        {headerName: "Player", field: "playerFullName", cellRenderer: playerNameCellRender},
        {headerName: "Status", field: "status"},
        {headerName: "Started", field: "startDate", cellRenderer: convertStartDate},
        {headerName: "Expires in", field: "endDate", cellRenderer: convertEndDate},
        {headerName: "Salary", field: "salary", cellRenderer: convertSalaryToCredits},
        {headerName: "Goal Bonus", field: "goalBonus", cellRenderer: convertGoalBonusToCredits}
    ];
    vm.gridPlayerOptions = {
        columnDefs: vm.teamPlayersDefs,
        rowData: vm.teamPlayersData,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        enableColResize: true,
        onGridReady: function(event) {
            console.log(event);
            updatePlayerGrid();
        },
    };
    vm.gridActiveContractsOptions = {
        columnDefs: vm.teamActiveContractsDefs,
        rowData: vm.teamActiveContractsData,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        enableColResize: true,
        onGridReady: function(event) {
            console.log(event);
            updateActiveContractsGrid();
        },
    };
    vm.gridPendingContractsOptions = {
        columnDefs: vm.teamPendingContractsDefs,
        rowData: vm.teamPendingContractsData,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        enableColResize: true,
        onGridReady: function(event) {
            console.log(event);
            updatePendingContractsGrid();
        },
    };
    $scope.goToPlayer = goToPlayer;

    vm.freePlayers = [];
    vm.signingPlayer = { selected: vm.freePlayers[0] };
    vm.sendContract = sendContract;
    vm.contractSalary = 0;
    vm.contractGoalBonusOne = 0;
    vm.contractGoalBonusTwo = 0;
    vm.contractGoalBonusThree = 0;

    function init() {
        setTeamModel(vm.teamId);
        setPlayersModel(vm.teamId);
        getTeamContracts(vm.teamId);
        getAllTeams();
        getAllPlayers();
    }

    function playerNameCellRender(params) {
        params.$scope.goToPlayer = goToPlayer;
        var string = '';
        if (params.data.uid) {
            string = "<a class=\"team-link\" ng-click=\"goToPlayer(data.uid)\">" + params.data.fullName + "</a>";
        } else {
            string = "<a class=\"team-link\" ng-click=\"goToPlayer(data.signingPlayer)\">" + params.data.playerFullName + "</a>";
        }
        return string;
    }

    function convertEndDate(params) {
        var day = moment(params.data.endDate);
        return day.toNow(true);
    }

    function convertStartDate(params) {
        var day = moment(params.data.startDate);
        return day.from(new Date());
    }

    function convertSalaryToCredits(params) {
        //regex to convert a string to a currency without $ symbol or digits.
        var credits = params.data.salary.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return credits;
    }

    function convertGoalBonusToCredits(params) {
        //regex to convert a string to a currency without $ symbol or digits.
        var credits = params.data.salary.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return credits;
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
            vm.isContractCreateMode = false;
        } else if (panel === 'stats') {
            vm.showPlayers = false;
            vm.showStats = true;
            vm.showActivities = false;
            vm.showContracts = false;
            vm.showMatches = false;
            vm.isContractCreateMode = false;
        } else if (panel === 'activities') {
            vm.showPlayers = false;
            vm.showStats = false;
            vm.showActivities = true;
            vm.showContracts = false;
            vm.showMatches = false;
            vm.isContractCreateMode = false;
        } else if (panel === 'contracts') {
            updateActiveContractsGrid();
            updatePendingContractsGrid();
            vm.showPlayers = false;
            vm.showStats = false;
            vm.showActivities = false;
            vm.showContracts = true;
            vm.showMatches = false;
            vm.isContractCreateMode = false;
        } else if (panel === 'matches') {
            vm.showPlayers = false;
            vm.showStats = false;
            vm.showActivities = false;
            vm.showContracts = false;
            vm.showMatches = true;
            vm.isContractCreateMode = false;
        } else if (panel === 'create contract') {
            vm.isContractCreateMode = true;
            vm.showPlayers = false;
            vm.showStats = false;
            vm.showActivities = false;
            vm.showContracts = true;
            vm.showMatches = false;
        }
    }


    function setTeamModel(id) {
        Data.fetchTeam(id).then(function(response) {
             vm.teamData = response.data;
             getOwnerName(vm.teamData.owner);
             getDivisionName(vm.teamData.division);
        });
    }

    function getTeamContracts(uid) {
        Data.fetchTeamContracts(uid).then(function(response) {
            var contractsData = utils.unpackObjectKeys(response.data);
            var activeContractsData = populateReferenceNames(contractsData, 'active');
            var pendingContractsData = populateReferenceNames(contractsData, 'pending');
            vm.teamActiveContractsData = activeContractsData;
            vm.teamPendingContractsData = pendingContractsData;
            updateActiveContractsGrid();
            updatePendingContractsGrid();
        });
    }

    function populateReferenceNames(contracts, status) {
        _.forEach(contracts, function(contract) {
            var matchedTeam = _.find(vm.allTeams, function(team) {
                return team.uid === contract.offerTeam;
            });
            var matchedPlayer = _.find(vm.allPlayers, function(player) {
                return player.uid === contract.signingPlayer;
            });
            contract.teamFullName = matchedTeam.name;
            contract.playerFullName = matchedPlayer.firstName + ' ' + matchedPlayer.lastName;
        });
        contracts = sortByStatus(contracts, status);
        return contracts;
    }

    function sortByStatus(contracts, status) {
        contracts = _.filter(contracts, function(contract) {
            return contract.status === status;
        });
        return contracts;
    }

    function getAllTeams() {
        Data.fetchAllTeams().then(function(response) {
            vm.allTeams = utils.unpackObjectKeys(response.data);
        });
    }

    function getAllPlayers() {
        Data.fetchAllPlayers().then(function(response) {
            vm.allPlayers = utils.unpackObjectKeys(response.data);
            determineFreePlayers(vm.allPlayers);
        });
    }

    function determineFreePlayers(allPlayers) {
        vm.freePlayers = _.filter(allPlayers, function(player) {
            return !player.team;
        });
        _.forEach(vm.freePlayers, function(freePlayer) {
            freePlayer.fullName = freePlayer.firstName + ' ' + freePlayer.lastName;
        });
    }

    function sendContract() {

    }

    function getOwnerName(uid) {
        Data.fetchUser(uid).then(function(response) {
            vm.teamData.ownerFullName = response.data.handle;
        });
    }

    function getDivisionName(uid) {
        Data.fetchDivision(uid).then(function(response) {
            vm.teamData.divisionName = response.data.name;
        });
    }

    function setPlayersModel(id) {
        Data.fetchTeamPlayers(id).then(function(response) {
            var playersWithFullNames = constructFullNames(response.data);
            vm.teamPlayersData = utils.unpackObjectKeys(playersWithFullNames);
            updatePlayerGrid();
        });
    }

    function updatePlayerGrid() {
        if (vm.gridPlayerOptions.api) {
            vm.gridPlayerOptions.api.setRowData(vm.teamPlayersData);
            vm.gridPlayerOptions.api.sizeColumnsToFit();
        }
    }

    function updateActiveContractsGrid() {
        if (vm.gridActiveContractsOptions.api) {
            vm.gridActiveContractsOptions.api.setRowData(vm.teamActiveContractsData);
            vm.gridActiveContractsOptions.api.sizeColumnsToFit();
        }
    }

    function updatePendingContractsGrid() {
        if (vm.gridPendingContractsOptions.api) {
            vm.gridPendingContractsOptions.api.setRowData(vm.teamPendingContractsData);
            vm.gridPendingContractsOptions.api.sizeColumnsToFit();
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

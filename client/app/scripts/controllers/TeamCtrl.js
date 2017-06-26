'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:TeamCtrl
* @description
* # TeamCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp').controller('TeamCtrl', function ($scope, $state, $stateParams, Data, utils, Events, $window, SweetAlert) {
    var vm = this;
    vm.teamId = $stateParams.teamId;
    vm.isTeamOwner = false;
    vm.isContractCreateMode = false;
    $scope.reviewContract = reviewContract;
    vm.isContractReview = false;
    vm.contractReviewData = {};
    vm.terminateContract = terminateContract;

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
        {headerName: "Action", field: "action", cellRenderer: contractAction},
        {headerName: "Started", field: "startDate", cellRenderer: convertStartDate},
        {headerName: "Expires in", field: "endDate", cellRenderer: convertEndDate},
        {headerName: "Salary", field: "salary", cellRenderer: convertSalaryToCredits},
        {headerName: "Goal Bonus(1pt)", field: "goalBonus1", cellRenderer: convertGoalBonus1ToCredits},
        {headerName: "Goal Bonus(2pt)", field: "goalBonus2", cellRenderer: convertGoalBonus2ToCredits},
        {headerName: "Goal Bonus(3pt)", field: "goalBonus3", cellRenderer: convertGoalBonus3ToCredits}
    ];
    vm.teamPendingContractsDefs = [
        {headerName: "Player", field: "playerFullName", cellRenderer: playerNameCellRender},
        {headerName: "Status", field: "status"},
        {headerName: "Action", field: "action", cellRenderer: contractAction},
        {headerName: "Started", field: "startDate", cellRenderer: convertStartDate},
        {headerName: "Expires in", field: "endDate", cellRenderer: convertEndDate},
        {headerName: "Salary", field: "salary", cellRenderer: convertSalaryToCredits},
        {headerName: "Goal Bonus(1pt)", field: "goalBonus1", cellRenderer: convertGoalBonus1ToCredits},
        {headerName: "Goal Bonus(2pt)", field: "goalBonus2", cellRenderer: convertGoalBonus2ToCredits},
        {headerName: "Goal Bonus(3pt)", field: "goalBonus3", cellRenderer: convertGoalBonus3ToCredits}
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

    function convertGoalBonus1ToCredits(params) {
        //regex to convert a string to a currency without $ symbol or digits.
        var credits = params.data.goalBonus1.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return credits || 0;
    }

    function convertGoalBonus2ToCredits(params) {
        //regex to convert a string to a currency without $ symbol or digits.
        var credits = params.data.goalBonus2.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return credits || 0;
    }

    function convertGoalBonus3ToCredits(params) {
        //regex to convert a string to a currency without $ symbol or digits.
        var credits = params.data.goalBonus3.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return credits || 0;
    }

    function contractAction(params) {
        console.log(params);
        return "<div class=\"grid-button\" ng-click=\"reviewContract(data)\">review</div>";
    }

    function reviewContract(data) {
        data.salary = parseInt(data.salary);
        data.goalBonus1 = parseInt(data.goalBonus1);
        data.goalBonus2 = parseInt(data.goalBonus2);
        data.goalBonus3 = parseInt(data.goalBonus3);
        data.startDate = moment(data.startDate);
        data.endDate = moment(data.endDate);
        data.teamLockIn = data.teamLockIn;
        data.playerLockIn = data.playerLockIn;
        vm.contractReviewData = data;
        vm.isContractReview = true;
        vm.isContractCreateMode = false;
    }

    function terminateContract() {
        var eventToSend = {};
        eventToSend.actor = vm.contractReviewData.signingPlayer;
        eventToSend.endDate = vm.contractReviewData.endDate;
        eventToSend.startDate = vm.contractReviewData.startDate;
        eventToSend.salary = vm.contractReviewData.salary;
        eventToSend.goalBonus1 = vm.contractReviewData.goalBonus1;
        eventToSend.goalBonus2 = vm.contractReviewData.goalBonus2;
        eventToSend.goalBonus3 = vm.contractReviewData.goalBonus3;
        eventToSend.offerTeam = vm.contractReviewData.offerTeam;
        eventToSend.signingPlayer = vm.contractReviewData.signingPlayer;
        eventToSend.playerLockIn = true;
        eventToSend.teamLockIn = false;
        eventToSend.contractUid = vm.contractReviewData.contractUid;
        eventToSend.type = 'contract:terminate';
        SweetAlert.swal({
           title: "Are you sure?",
           text: "You are terminating an active contract!",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "Yes, delete it!",
           closeOnConfirm: true},
        function(){
           Events.create(eventToSend).then(function(response) {
               console.log(response);
               vm.isContractCreateMode = false;
               vm.isContractReview = false;
               init();
               $window.iziToast.success({
                   title: 'OK',
                   icon: 'fa fa-thumbs-o-up',
                   message: 'Contract terminated',
                   position: 'bottomCenter'
               });
           }).catch(function (error) {
               $window.iziToast.error({
                   icon: 'fa fa-warning',
                   message: error,
                   position: 'bottomCenter'
               });
           });
        });
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
            vm.contractStartDate = moment(new Date());
            vm.contractEndDate = moment(new Date());
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

    function validateForm(eventToSend) {
        if (!eventToSend.actor || !eventToSend.signingPlayer) {
            return 'A player required';
        } else if (!eventToSend.salary) {
            return 'A salary is required';
        } else if (!eventToSend.startDate || !eventToSend.endDate) {
            return 'A start and end date is required';
        } else {
            return true;
        }
    }

    function sendContract() {
        var eventToSend = {};
        eventToSend.actor = vm.signingPlayer.selected.uid;
        eventToSend.startDate = vm.contractStartDate;
        eventToSend.endDate = vm.contractEndDate;
        eventToSend.salary = vm.contractSalary;
        eventToSend.goalBonus1 = vm.contractGoalBonusOne;
        eventToSend.goalBonus2 = vm.contractGoalBonusTwo;
        eventToSend.goalBonus3 = vm.contractGoalBonusThree;
        eventToSend.offerTeam = vm.teamData.uid;
        eventToSend.signingPlayer = vm.signingPlayer.selected.uid;
        eventToSend.playerLockIn = false;
        eventToSend.teamLockIn = true;
        eventToSend.type = 'contract:createPlayer';
        var isValid = validateForm(eventToSend);
        if (isValid === true) {
            Events.create(eventToSend).then(function(response) {
                console.log(response);
                vm.isContractCreateMode = false;
                vm.isContractReview = false;
                init();
                $window.iziToast.success({
                    title: 'OK',
                    icon: 'fa fa-thumbs-o-up',
                    message: 'Contract offer made',
                    position: 'bottomCenter'
                });
            }).catch(function (error) {
                $window.iziToast.error({
                    icon: 'fa fa-warning',
                    message: error,
                    position: 'bottomCenter'
                });
            });
        } else {
            $window.iziToast.error({
                icon: 'fa fa-warning',
                message: isValid,
                position: 'bottomCenter'
            });
        }
    }

    function getOwnerName(uid) {
        Data.fetchUser(uid).then(function(response) {
            vm.teamData.ownerFullName = response.data.handle;
            vm.teamData.ownerUid = response.data.uid;
            determineIfTeamOwner();
        });
    }

    function determineIfTeamOwner() {
        var loggedInUserId = $window.firebase.auth().currentUser.uid;
        var teamOwnerId = vm.teamData.ownerUid;
        if (loggedInUserId.toString() === teamOwnerId.toString()) {
            vm.isTeamOwner = true;
        } else {
            vm.isTeamOwner = false;
        }
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

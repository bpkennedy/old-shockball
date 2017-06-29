'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:PlayerCtrl
* @description
* # PlayerCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('PlayerCtrl', function ($http, $scope, $state, $stateParams, Data, $window, Events, utils, SweetAlert) {
    var vm = this;
    vm.playerId = $stateParams.playerId ? $stateParams.playerId : $window.firebase.auth().currentUser.uid;
    vm.playerData = {};
    vm.playerSkills = [];
    vm.allTeams = [];
    vm.teamData = {};
    vm.contractData = [];
    vm.isContractReview = false;
    vm.contractIsChanged = false;
    vm.contractReviewData = {};
    vm.matchesData = [];
    vm.eventsData = [];
    vm.radarData = [];
    vm.radarLabels = [];
    vm.colors = [
        {
              backgroundColor:"#fafafa",
              hoverBackgroundColor:"#fafafa",
              borderColor:"#fafafa",
              hoverBorderColor:"#fafafa"
        }
    ];
    vm.showSkills = true;
    vm.showStats = false;
    vm.showActivities = false;
    vm.showContract = false;
    vm.showMatches = false;
    vm.isTrainingMode = false;
    vm.isCurrentUser = false;
    vm.showPanel = showPanel;
    vm.changeTraining = changeTraining;
    vm.saveTraining = saveTraining;
    vm.cancelTraining = cancelTraining;
    vm.trainSkill = { selected: vm.playerSkills[0] };
    vm.intensities = [
        { id: 1, title: 'Super Safe'},
        { id: 1, title: 'Normal'},
        { id: 1, title: 'Beast Mode' }
    ];
    vm.trainIntensity = { selected: vm.intensities[0] };

    vm.calculateTimeRemaining = calculateTimeRemaining;
    vm.playerContractsDefs = [
        {headerName: "Team", field: "teamFullName", cellRenderer: teamNameCellRender},
        {headerName: "Status", field: "status",},
        {headerName: "Action", field: "action", cellRenderer: contractAction},
        {headerName: "Started", field: "startDate", cellRenderer: convertStartDate},
        {headerName: "Expires in", field: "endDate", cellRenderer: convertEndDate},
        {headerName: "Salary", field: "salary", cellRenderer: convertSalaryToCredits},
        {headerName: "Goal Bonus(1pt)", field: "goalBonus1", cellRenderer: convertGoalBonus1ToCredits},
        {headerName: "Goal Bonus(2pt)", field: "goalBonus2", cellRenderer: convertGoalBonus2ToCredits},
        {headerName: "Goal Bonus(3pt)", field: "goalBonus3", cellRenderer: convertGoalBonus3ToCredits}
    ];
    vm.gridContractsOptions = {
        columnDefs: vm.playerContractsDefs,
        rowData: vm.contractData,
        angularCompileRows: true,
        enableFilter: true,
        enableSorting: true,
        enableColResize: true,
        onGridReady: function(event) {
            console.log(event);
            updateContractsGrid();
        },
    };
    $scope.goToTeam = goToTeam;
    $scope.reviewContract = reviewContract;
    vm.saveContract = saveContract;
    vm.terminateContract = terminateContract;

    function init() {
        getAllTeams();
        setPlayerModel(vm.playerId);
        checkIfCurrentUser();
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
        eventToSend.playerLockIn = vm.contractReviewData.playerLockIn;
        eventToSend.teamLockIn = vm.contractReviewData.teamLockIn;
        eventToSend.contractUid = vm.contractReviewData.contractUid;
        eventToSend.type = 'contract:playerTerminate';
        var message = '';
        if (vm.contractReviewData.status === 'pending') {
            message = "You are terminating a pending contract.";
        } else {
            message = "You are terminating an active contract!  This will cause a small skill debuff to your team for the rest of the season!";
        }
        SweetAlert.swal({
           title: "Are you sure?",
           text: message,
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "Yes, delete it!",
           closeOnConfirm: true},
        function(){
           Events.create(eventToSend).then(function(response) {
               console.log(response);
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

    function saveContract(counter) {
        var eventToSend = {};
        eventToSend.actor = vm.playerId;
        eventToSend.endDate = vm.contractReviewData.endDate;
        eventToSend.startDate = vm.contractReviewData.startDate;
        eventToSend.salary = vm.contractReviewData.salary;
        eventToSend.goalBonus1 = vm.contractReviewData.goalBonus1;
        eventToSend.goalBonus2 = vm.contractReviewData.goalBonus2;
        eventToSend.goalBonus3 = vm.contractReviewData.goalBonus3;
        eventToSend.offerTeam = vm.contractReviewData.offerTeam;
        eventToSend.signingPlayer = vm.contractReviewData.signingPlayer;
        if (counter) {
            eventToSend.teamLockIn = false;
        } else {
            eventToSend.teamLockIn = vm.contractReviewData.teamLockIn;
        }
        eventToSend.playerLockIn = true;
        eventToSend.contractUid = vm.contractReviewData.contractUid;
        eventToSend.type = 'contract:player';
        Events.create(eventToSend).then(function(response) {
            console.log(response);
            vm.isContractReview = false;
            init();
            $window.iziToast.success({
                title: 'OK',
                icon: 'fa fa-thumbs-o-up',
                message: 'Contract counter offer made',
                position: 'bottomCenter'
            });
        }).catch(function (error) {
            $window.iziToast.error({
                icon: 'fa fa-warning',
                message: error,
                position: 'bottomCenter'
            });
        });
    }

    function contractAction(params) {
        console.log(params);
        var loggedInUserId = $window.firebase.auth().currentUser.uid;
        var profilePlayerId = vm.playerId;
        if (loggedInUserId.toString() === profilePlayerId.toString()) {
            return "<div class=\"grid-button\" ng-click=\"reviewContract(data)\">review</div>";
        } else {
            return '';
        }
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
        return credits || 0;
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

    function teamNameCellRender(params) {
        params.$scope.goToTeam = goToTeam;
        return "<a class=\"team-link\" ng-click=\"goToTeam(data.offerTeam)\">" + params.data.teamName + "</a>";
    }

    function goToTeam(id) {
        $state.go('root.team', { teamId: id });
    }

    function changeTraining() {
        vm.isTrainingMode = true;
    }

    function checkIfCurrentUser() {
        var loggedInUserId = $window.firebase.auth().currentUser.uid;
        var profilePlayerId = vm.playerId;
        if (loggedInUserId.toString() === profilePlayerId.toString()) {
            vm.isCurrentUser = true;
        }
    }

    function saveTraining() {
        var eventToSend = {};
        eventToSend.actor = vm.playerId;
        eventToSend.type = 'train:' + vm.trainSkill.selected.title;
        eventToSend.intensity = vm.trainIntensity.selected.title;
        Events.create(eventToSend).then(function(response) {
            console.log(response);
            $window.iziToast.success({
                title: 'OK',
                icon: 'fa fa-thumbs-o-up',
                message: 'Changed training to ' + vm.trainSkill.selected.title,
                position: 'bottomCenter'
            });
        }).catch(function (error) {
            $window.iziToast.error({
                icon: 'fa fa-warning',
                message: error,
                position: 'bottomCenter'
            });
        });
    }

    function cancelTraining() {
        vm.isTrainingMode = false;
    }

    function showPanel(panel) {
        if (panel === 'skills') {
            vm.showSkills = true;
            vm.showStats = false;
            vm.showActivities = false;
            vm.showContract = false;
            vm.showMatches = false;
        } else if (panel === 'stats') {
            vm.showSkills = false;
            vm.showStats = true;
            vm.showActivities = false;
            vm.showContract = false;
            vm.showMatches = false;
        } else if (panel === 'activities') {
            vm.showSkills = false;
            vm.showStats = false;
            vm.showActivities = true;
            vm.showContract = false;
            vm.showMatches = false;
        } else if (panel === 'contract') {
            vm.showSkills = false;
            vm.showStats = false;
            vm.showActivities = false;
            vm.showContract = true;
            vm.showMatches = false;
        } else if (panel === 'matches') {
            vm.showSkills = false;
            vm.showStats = false;
            vm.showActivities = false;
            vm.showContract = false;
            vm.showMatches = true;
        }
    }

    function setPlayerModel(id) {
        Data.fetchPlayer(id).then(function(response) {
            if (response.data === "") {
                //player does not exist in players collection, needs to create
                $state.go('root.playerCreate');
            }
            vm.playerData = response.data;
            vm.playerSkills = createPlayerSkills(vm.playerData);
            setContractModel(vm.playerId);
            if (vm.playerData.team) {
                setTeamModel(vm.playerData.team);
                setMatchesModel(vm.playerData.team);
                setEventsModel(vm.playerId);
            }
        });
    }

    function getAllTeams() {
        Data.fetchAllTeams().then(function(response) {
            vm.allTeams = utils.unpackObjectKeys(response.data);
        });
    }

    function createPlayerSkills(playerData) {
        var skills = [];
        _.forEach(playerData, function(value, key) {
            if (key === "throwing" || key === "blocking" || key === "passing" || key === "endurance" || key === "toughness" || key === "vision" || key === "leadership") {
                var skill = {
                    title: key,
                    value: value
                };
                skills.push(skill);
                vm.radarData.push(value);
                vm.radarLabels.push(key);
            }
        });
        return skills;
    }

    function setTeamModel(teamId) {
        Data.fetchTeam(teamId).then(function(response) {
            vm.teamData = response.data;
        });
    }

    function setContractModel(id) {
        Data.fetchPlayerContract(id).then(function(response) {
            var contracts = utils.unpackObjectKeys(response.data);
            var contractsWithFullNames = constructFullNames(contracts);
            vm.contractData = contractsWithFullNames;
            updateContractsGrid();
        });
    }

    function constructFullNames(contracts) {
        _.forEach(contracts, function(contract) {
            var matchedTeam = _.find(vm.allTeams, function(team) {
                return team.uid === contract.offerTeam;
            });
            contract.teamName = matchedTeam.name;
        });
        return contracts;
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

    function updateContractsGrid() {
        if (vm.gridContractsOptions.api) {
            vm.gridContractsOptions.api.setRowData(vm.contractData);
            vm.gridContractsOptions.api.sizeColumnsToFit();
        }
    }

    function calculateTimeRemaining(endDate) {
        var timeRemaining = moment().countdown(endDate, countdown.WEEKS, NaN).toString();
        if (!timeRemaining) {
            return '';
        } else {
            return '(' + timeRemaining + ' left)';
        }
    }

    init();
});

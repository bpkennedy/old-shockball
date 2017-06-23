'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:PlayerCtrl
* @description
* # PlayerCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('PlayerCtrl', function ($http, $scope, $state, $stateParams, Data, $window, Events) {
    var vm = this;
    vm.playerId = $stateParams.playerId ? $stateParams.playerId : $window.firebase.auth().currentUser.uid;
    vm.playerData = {};
    vm.playerSkills = [];
    vm.teamData = {};
    vm.contractData = {};
    vm.matchesData = [];
    vm.eventsData = [];
    vm.radarData = [];
    vm.radarLabels = [];
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

    function init() {
        setPlayerModel(vm.playerId);
        checkIfCurrentUser();
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
            if (vm.playerData.team) {
                setTeamModel(vm.playerData.team);
                setMatchesModel(vm.playerData.team);
                setContractModel(vm.playerId);
                setEventsModel(vm.playerId);
            }
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

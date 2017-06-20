'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:AdminCtrl
* @description
* # AdminCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('AdminCtrl', function (Data, utils, $scope, $window, Events) {
    var vm = this;
    vm.sendEvent = sendEvent;
    vm.showEvents = true;
    vm.showActivations = false;
    vm.showPanel = showPanel;
    vm.approvePlayer = approvePlayer;
    vm.rejectPlayer = rejectPlayer;
    vm.event = {
       actor: '',
       oppActor: null,
       secondaryOppActor: null,
       type: '',
       intensity: null,
       team: null,
       match: null,
       oppTeam: null,
       time: new Date().toJSON()
    };
    vm.types = [
        { id: 1, title: 'hit'},
        { id: 2, title: 'score'},
        { id: 3, title: 'foul'},
        { id: 4, title: 'injury'},
        { id: 5, title: 'pass'},
        { id: 6, title: 'miss'},
        { id: 7, title: 'block'},
        { id: 8, title: 'contract'},
        { id: 9, title: 'player created'},
        { id: 10, title: 'captain selected'}
    ];
    vm.intensities = [
        { id:1, title: '1'},
        { id:2, title: '2'},
        { id:3, title: '3'}
    ];
    vm.people = [];
    vm.teams = [];
    vm.matches = [];
    vm.playerSubmissions = [];
    vm.type = { selected: vm.types[0] };
    vm.intensity = { selected: vm.intensities[0] };
    vm.actor = { selected : "someemail@email.com" };
    vm.oppActor = { selected : "someemail@email.com" };
    vm.team = { selected: {} };
    vm.match = { selected: {} };
    vm.oppTeam = { selected: {} };

    function init() {
        getPlayers();
        getPlayerSubmissions();
        getTeams();
        getMatches();
    }

    function showPanel(panel) {
        if (panel === 'events') {
            vm.showEvents = true;
            vm.showActivations = false;
        } else if (panel === 'activations') {
            vm.showEvents = false;
            vm.showActivations = true;
        }
    }

    function approvePlayer(submission) {
        Data.createPlayer(submission).then(function(response) {
            var player = response.data;
            var newPlayer = {};
            newPlayer.actor = player.uid;
            newPlayer.oppActor = null;
            newPlayer.secondaryOppActor = null;
            newPlayer.type = 'player created';
            newPlayer.intensity = null;
            newPlayer.match = null;
            newPlayer.team = null;
            newPlayer.oppTeam = null;
            newPlayer.time = new Date().toJSON();
            Events.create(newPlayer).then(function(response) {
                console.log(response);
                $window.iziToast.info({
                    icon: 'fa fa-info-circle',
                    message: 'New Player Event created',
                    position: 'bottomCenter'
                });
            }).catch(function (error) {
                console.log(error);
                $window.iziToast.error({
                    icon: 'fa fa-warning',
                    message: error
                });
            });
            init();
        });
    }

    function rejectPlayer(key) {
        Data.rejectPlayer(key).then(function(response) {
            console.log(response);
            init();
        });
    }

    function getPlayers() {
        Data.fetchAllPlayers().then(function(response) {
            vm.people = response.data;
            $scope.$applyAsync();
        });
    }

    function getPlayerSubmissions() {
        Data.fetchAllPlayerSubmissions().then(function(response) {
            vm.playerSubmissions = response;
        });
    }

    function getTeams() {
        Data.fetchAllTeams().then(function(response) {
            vm.teams = response.data;
            $scope.$applyAsync();
        });
    }

    function getMatches() {
        Data.fetchAllMatches().then(function(response) {
            vm.matches = utils.unpackObjectKeys(response.data);
            $scope.$applyAsync();
        });
    }

    function sendEvent() {
        vm.event = {};
        vm.event.actor = vm.actor.selected.objectKey;
        vm.event.oppActor = vm.oppActor.selected.objectKey || null;
        vm.event.secondaryOppActor = null;
        vm.event.type = vm.type.selected.title;
        vm.event.intensity = vm.intensity.selected.title || null;
        vm.event.match = vm.match.selected.objectKey || null;
        vm.event.team = vm.team.selected.objectKey || null;
        vm.event.oppTeam = vm.oppTeam.selected.objectKey || null;
        vm.event.time = new Date().toJSON();
        Events.create(vm.event).then(function(response) {
            console.log(response);
            $window.iziToast.info({
                icon: 'fa fa-info-circle',
                message: 'Event created',
                position: 'bottomCenter'
            });
        }).catch(function (error) {
            console.log(error);
            $window.iziToast.error({
                icon: 'fa fa-warning',
                message: error
            });
        });
    }

    init();

});

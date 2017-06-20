'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:PlayercreateCtrl
* @description
* # PlayercreateCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('PlayerCreateCtrl', function ($window, Data) {
    var vm = this;
    vm.userId = $window.firebase.auth().currentUser.uid;
    vm.isAwaitingActivation = false;
    vm.totalPoints = 35;
    vm.application = {
        firstName: '',
        lastName: '',
        species: '',
        picUrl: '',
        planet: '',
        age: 0,
        aggro: 0,
        morale: 50,
        fatigue: 0,
        xp: 0,
        throwing: 0,
        passing: 0,
        blocking: 0,
        toughness: 30,
        vision: 0,
        endurance: 45,
        leadership: 0
    };
    vm.genders = [
        { id: 1, title: 'male'},
        { id: 2, title: 'female'}
    ];
    vm.roles = [
        { id: 1, title: 'Guard' },
        { id: 2, title: 'Center' },
        { id: 3, title: 'Wing' }
    ];
    vm.role = { selected: vm.roles[0] };
    vm.gender = { selected: vm.genders[0] };
    vm.increment = increment;
    vm.decrement = decrement;
    vm.submitPlayer = submitPlayer;

    function init() {
        checkApprovalState();
    }

    function checkApprovalState() {
        Data.fetchPlayerSubmission(vm.userId).then(function(response) {
            console.log(response.data);
            if (response.data !== '') {
                vm.isAwaitingActivation = true;
            }
        });
    }

    function submitPlayer() {
        vm.application.uid = $window.firebase.auth().currentUser.uid;
        $window.firebase.auth().currentUser.getToken(true).then(function(idToken) {
            vm.application.idToken = idToken;
            vm.application.role = vm.role.selected.title;
            vm.application.gender = vm.gender.selected.title;
            var isValid = validateForm();
            if (isValid === true) {
                Data.submitPlayer(vm.application).then(function(response) {
                    console.log(response);
                    vm.isAwaitingActivation = true;
                    $window.iziToast.info({
                        icon: 'fa fa-info-circle',
                        message: 'Player submitted for creation',
                        position: 'bottomCenter'
                    });
                }).catch(function (error) {
                    $window.iziToast.error({
                        icon: 'fa fa-warning',
                        message: error
                    });
                });
            } else {
                $window.iziToast.error({
                    icon: 'fa fa-warning',
                    message: 'Error: ' + isValid
                });
            }
        });
    }

    function validateForm() {
        if (vm.application.uid) {
            if (vm.totalPoints === 0) {
                if (vm.application.firstName === '' || vm.application.lastName === '' || vm.application.species === '' || vm.application.picUrl === '' || vm.application.planet === '') {
                    return 'must complete biography fields';
                } else {
                    return true;
                }
            } else {
                return 'must spend all skill points';
            }
        } else {
            return 'must be logged in to create a player.';
        }
    }

    function increment(property) {
        if (vm.totalPoints > 0) {
            if (property === 'toughness' || property === 'endurance' || property === 'leadership') {
                vm['application'][property] = vm['application'][property] + 4;
                vm.totalPoints--;
            } else {
                vm['application'][property]++;
                vm.totalPoints--;
            }
        }
    }

    function decrement(property) {
        if (vm.totalPoints < 35) {
            if (property === 'toughness' || property === 'endurance' || property === 'leadership') {
                vm['application'][property] = vm['application'][property] - 4;
                vm.totalPoints++;
            } else {
                vm['application'][property]--;
                vm.totalPoints++;
            }
        }
    }

    init();

});

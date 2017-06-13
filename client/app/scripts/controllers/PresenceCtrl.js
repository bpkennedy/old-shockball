'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:PresenceCtrl
* @description
* # PresenceCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('PresenceCtrl', function ($scope, $window, auth, currentUser, toaster) {
    var vm = this;
    vm.userId = '';
    vm.amOnline = {};
    vm.userRef = {};
    vm.presenceUsers = [];
    vm.defaultPic = '../images/defaultImage.png';
    vm.openPanel = false;
    vm.getPresence = getPresence;
    var idle = new window.Idle({
        onAway: onAway,
        onAwayBack: onBack,
        awayTimeout: 60000 //away with 60 seconds of inactivity
    }).start();
    console.log(idle);

    function getPresence(className) {
        return className;
    }

    function init() {
        setUserId();
        createAmOnline();
        createUserRef();
        setPresenceListener();
    }

    function setUserId() {
        vm.userId = auth.$getAuth() ? auth.$getAuth().uid : null;
    }

    function getUser() {
        return auth.$getAuth();
    }

    function createAmOnline() {
        vm.amOnline = $window.firebase.database().ref('.info/connected');
    }

    function createUserRef() {
        vm.userRef = $window.firebase.database().ref('presence/' + vm.userId);
    }

    function manualDisconnect(userObj) {
        vm.userRef.set({
            handle: userObj.user.displayName || userObj.user.email,
            photoURL: userObj.user.photoURL || null,
            status: '☆ offline',
            class: 'offline'
        });
    }

    function setPresenceListener() {
        if (getUser()) {
            vm.amOnline.on('value', function(snapshot) {
                if (snapshot.val()) {
                    vm.userRef.onDisconnect().set({
                        handle: getUser().displayName || getUser().email,
                        photoURL: getUser().photoURL || null,
                        status: '☆ offline',
                        class: 'offline'
                    });
                    vm.userRef.set({
                        handle: getUser().displayName || getUser().email,
                        photoURL: getUser().photoURL || null,
                        status: '★ online',
                        class: 'online'
                    });
                }
            });
        }
    }

    function onAway() {
        if(getUser()) {
            vm.userRef.set({
                handle: getUser().displayName || getUser().email,
                photoURL: getUser().photoURL || null,
                status: '☄ away',
                class: 'away'
            });
        }
    }

    function onBack() {
        if (getUser()) {
            vm.userRef.set({
                handle: getUser().displayName || getUser().email,
                photoURL: getUser().photoURL || null,
                status: '★ online',
                class: 'online'
            });
        }
    }

    $window.firebase.database().ref('presence').on("value", function(snapshot) {
        vm.presenceUsers = snapshot.val();
        $scope.$applyAsync();
    }, function(error) {
        console.log(error);
        toaster.pop({
            type: 'error',
            title: 'Error: could not get presence users',
            timeout: 3000
        });
    });

    $scope.$on('login:signed out', function(event, args) {
        manualDisconnect(args);
    });

    $scope.$on('login:signed in', function() {
        init();
    });

    $scope.$on('titlebar: open nav', function() {
        vm.openPanel = !vm.openPanel;
    });

    init();
});
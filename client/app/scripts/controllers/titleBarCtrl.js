'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:TitleBarCtrl
* @description
* # TitleBarCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('TitleBarCtrl', function ($rootScope, $scope, $state, auth, currentUser) {
    var vm = this;
    vm.isAdmin = false;
    vm.loggedInUser = null;
    vm.isRunningEngine = false;
    vm.goToLogin = goToLogin;
    vm.goToHome = goToHome;
    vm.openPresence = openPresence;

    function init() {
        setUser();
    }

    function isAdmin() {
        if (vm.loggedInUser.email === 'bpkennedy@gmail.com' || vm.loggedInUser.email === 'realgamer69@yahoo.com' || vm.loggedInUser.email === 'bhersey36@gmail.com') {
            vm.isAdmin = true;
        } else {
            vm.isAdmin = false;
        }
    }

    function openPresence() {
        $rootScope.$broadcast('titlebar: toggle nav');
    }

    function goToHome() {
        $state.go('root.dashboard');
    }

    function goToLogin() {
        $state.go('root.login');
    }

    function setUser() {
        if (currentUser) {
            vm.loggedInUser = currentUser;
            isAdmin();
        }
    }

    auth.$onAuthStateChanged(function(firebaseUser) {
        vm.loggedInUser = firebaseUser;
        isAdmin();
        $scope.$apply();
    });

    $scope.$on('presence:app true', function() {
        vm.isRunningEngine = true;
        $scope.$applyAsync();
    });

    $scope.$on('presence:app false', function() {
        vm.isRunningEngine = false;
        $scope.$applyAsync();
    });

    $scope.$on('presence:close panel', function() {
        vm.isRunningEngine = false;
        $scope.$applyAsync();
    });

    $scope.$on('login:signed out', function() {
        vm.isAdmin = false;
        $scope.$applyAsync();
    });

    init();
});

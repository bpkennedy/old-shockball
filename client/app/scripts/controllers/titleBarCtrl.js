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
    vm.loggedInUser = null;
    vm.isRunningEngine = false;
    vm.goToLogin = goToLogin;
    vm.goToHome = goToHome;
    vm.openPresence = openPresence;

    function init() {
        setUser();
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
        }
    }

    auth.$onAuthStateChanged(function(firebaseUser) {
        vm.loggedInUser = firebaseUser;
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

    init();
});

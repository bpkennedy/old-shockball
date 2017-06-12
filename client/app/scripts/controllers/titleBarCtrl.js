'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:TitleBarCtrl
* @description
* # TitleBarCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('TitleBarCtrl', function ($scope, $state, auth, currentUser) {
    var vm = this;
    vm.loggedInUser = null;
    vm.isRunningEngine = false;
    vm.goToLogin = goToLogin;
    vm.goToHome = goToHome;

    function init() {
        setUser();
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

    init();
});

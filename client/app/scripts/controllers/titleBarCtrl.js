'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:TitleBarCtrl
* @description
* # TitleBarCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('TitleBarCtrl', function ($scope) {
    var vm = this;
    vm.isRunningEngine = false;

    function init() {

    }

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

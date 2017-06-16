'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:EventsCtrl
* @description
* # EventsCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('EventsCtrl', function ($window, $scope, Data) {
    var vm = this;
    vm.events = [];

    function init() {
        getPublicEvents();
    }

    function getPublicEvents() {
        $window.firebase.database().ref('events').on("value", function(snapshot) {
            vm.events = snapshot.val();
            $scope.$applyAsync();
        }, function(error) {
            $window.iziToast.error({
                title: 'Error',
                icon: 'fa fa-warning',
                message: error
            });
        });
    }

    init();
});

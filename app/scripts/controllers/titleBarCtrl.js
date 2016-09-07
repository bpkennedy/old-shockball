'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:TitleBarCtrl
* @description
* # TitleBarCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('TitleBarCtrl', function ($mdSidenav) {
    var titleBar = this;
    titleBar.toggleList = function() {
        console.log('fired');
        $mdSidenav('left').toggle();
    };
    console.log(titleBar);

});

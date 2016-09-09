'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('MainCtrl', function (Auth) {
    var main = this;
    main.auth = Auth;
    main.currentAuth = main.auth.$getAuth();
    console.log(main.currentAuth);
    main.test = 'test';
});

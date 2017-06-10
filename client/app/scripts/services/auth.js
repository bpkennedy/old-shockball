'use strict';

/**
* @ngdoc service
* @name shockballApp.auth
* @description
* # auth
* Factory in the clientApp.
*/
angular.module('shockballApp')
.factory('auth', function ($firebaseAuth) {
    return $firebaseAuth();
});

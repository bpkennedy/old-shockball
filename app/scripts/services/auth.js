'use strict';

/**
 * @ngdoc service
 * @name shockballApp.Auth
 * @description
 * # Auth
 * Factory in the shockballApp.
 */
angular.module('shockballApp')
  .factory('Auth', function ($firebaseAuth) {
      return $firebaseAuth();
  });

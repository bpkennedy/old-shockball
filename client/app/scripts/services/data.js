'use strict';

/**
 * @ngdoc service
 * @name shockballApp.Data
 * @description
 * # Data
 * Factory in the shockballApp.
 */
angular.module('shockballApp')
  .factory('Data', function ($http) {
      var url = '/time/';
      function fetchTime(){
          return $http.get(url);
      }

      return {
        fetchTime: fetchTime
      };
  });

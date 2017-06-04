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
      var url = '/matches/awayTeam/32432523';
      function fetchTime(){
          return $http.get(url, { cache: true });
      }

      return {
        fetchTime: fetchTime
      };
  });

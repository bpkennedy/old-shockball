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
      var url = 'https://www.swcombine.com/ws/v1.0/api/time/cgt/';
      function fetchTime(){
          return $http.get(url).then(function(response){
            return response;
          });
      }

      return {
        fetchTime: fetchTime
      };
  });

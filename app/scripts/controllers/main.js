'use strict';

/**
 * @ngdoc function
 * @name shockballApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the shockballApp
 */
angular.module('shockballApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name shockballApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the shockballApp
 */
angular.module('shockballApp')
  .controller('AboutCtrl', function (Data) {
    var vm = this;
    vm.testData = {};

    function init() {
        setData();
    }

    function setData() {
        Data.fetchTime().then(function(response) {
            vm.testData = response;
        });
    }

    init();

  });

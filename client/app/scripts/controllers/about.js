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
    var about = this;
    about.testData = {};

    function init() {
        setData();
    }

    function setData() {
        Data.fetchTime().then(function(response) {
            console.log(response);
            about.testData = response;
        });
    }

    init();

  });

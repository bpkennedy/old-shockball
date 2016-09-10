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
    about.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    about.testData = {};

    function init() {
        setData();
    }

    function setData() {
        Data.fetchTime().then(function(response) {
            about.testData = response;
        });
    }

    init();

  });

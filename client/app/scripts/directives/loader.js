'use strict';

/**
 * @ngdoc directive
 * @name shockballApp.directive:loader
 * @description
 * # loader
 */
angular.module('shockballApp')
  .directive('loader', function () {
    return {
      restrict: 'EA',
      scope: {
          title: '@'
      },
      controller: 'LoaderCtrl',
      controllerAs: 'vm',
      bindToController: true,
      template: "<div class=\"loader\" ng-if=\"vm.show\">" +
        "  <div class=\"pitch\"></div>" +
        "  <div class=\"circle\"></div>" +
        "  <div class=\"players\">" +
        "    <div class=\"player\"></div>" +
        "    <div class=\"player\"></div>" +
        "    <div class=\"player\"></div>" +
        "    <div class=\"player\"></div>" +
        "    <div class=\"player\"></div>" +
        "    <div class=\"player\"></div>" +
        "    <div class=\"player\"></div>" +
        "    <div class=\"player\"></div>" +
        "    <div class=\"player\"></div>" +
        "    <div class=\"player\"></div>" +
        "  </div>" +
        "</div>",
    };
});

angular.module('shockballApp').controller('LoaderCtrl', function loaderCtrl($scope) {
    var vm = this;
    vm.show = false;

    $scope.$on('loader: toggle off', function() {
        vm.show = false;
        $scope.$applyAsync();
    });

    $scope.$on('loader: toggle on', function() {
        vm.show = true;
        $scope.$applyAsync();
    });
});

angular.module('shockballApp').factory('loaderSvc', function loaderSvcFunc($rootScope) {

    function toggleOn() {
        $rootScope.$broadcast('loader: toggle on');
    }

    function toggleOff() {
        $rootScope.$broadcast('loader: toggle off');
    }

    return {
        toggleOn: toggleOn,
        toggleOff: toggleOff
    };
});

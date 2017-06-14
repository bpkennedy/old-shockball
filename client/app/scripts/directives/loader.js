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
      templateUrl: '/views/loader.html',
      restrict: 'EA',
      scope: {
          title: '@'
      },
      controller: 'LoaderCtrl',
      controllerAs: 'vm',
      bindToController: true
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

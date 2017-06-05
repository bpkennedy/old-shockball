'use strict';

/**
* @ngdoc overview
* @name shockballApp
* @description
* # shockballApp
*
* Main module of the application.
*/
// get ag-Grid to create an Angular module and register the ag-Grid directive
agGrid.initialiseAgGridWithAngular1(angular);

angular
.module('shockballApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router',
    'chart.js',
    'agGrid'
])
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('root', {
        abstract:true,
        url: '',
        views: {
            'titleBar@': {
                templateUrl: 'views/titleBar.html',
                controller: 'TitleBarCtrl',
                controllerAs: 'vm'
            }
        }
    })
    .state('root.dashboard', {
        url:'/',
        views: {
            'container@': {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'vm'
            }
        }
    })
    .state('root.player', {
        url:'/player/:playerId',
        parent: 'root',
        views: {
            'container@': {
                templateUrl: 'views/player.html',
                controller: 'PlayerCtrl',
                controllerAs: 'vm'
            }
        }
    })
    .state('root.about', {
        url:'/about',
        views: {
            'container@': {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'vm'
            }
        }
    })
    .state('root.profile', {
        url:'/profile',
        views: {
            'container@': {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl',
                controllerAs: 'vm'
            }
        }
    })
    .state('root.login', {
        url:'/login',
        views: {
            'container@': {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm'
            }
        }
    });
})
.config(function () {
})
.run(['$rootScope', function () {
}]);

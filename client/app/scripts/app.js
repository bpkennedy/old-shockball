'use strict';

/**
* @ngdoc overview
* @name shockballApp
* @description
* # shockballApp
*
* Main module of the application.
*/
angular
.module('shockballApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router',
    'chart.js'
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

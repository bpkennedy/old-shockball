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
    'firebase',
    'ui.router',
    'ngMaterial'
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
                controllerAs: 'titleBar'
            },
            'sideNav@': {
                templateUrl: 'views/sideNav.html',
                controller: 'SideNavCtrl',
                controllerAs: 'sideNav'
            }
        }
    })
    .state('root.dashboard', {
        url:'/',
        views: {
            'container@': {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            }
        },
        resolve: {
            Auth: 'Auth',
            getAuth: ['Auth', function (Auth) {
                return Auth.$waitForSignIn();
            }],
        }
    })
    .state('root.about', {
        url:'/about',
        views: {
            'container@': {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            }
        }
    })
    .state('root.login', {
        url:'/login',
        views: {
            'container@': {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
            }
        }
    });
})
.config(function ($mdThemingProvider, $mdIconProvider) {
    $mdIconProvider
        .defaultIconSet('../images/svg/avatars.svg', 128)
        .icon('menu'       , '../images/svg/menu.svg'        , 24)
        .icon('share'      , '../images/svg/share.svg'       , 24)
        .icon('google_plus', '../images/svg/google_plus.svg' , 512)
        .icon('hangouts'   , '../images/svg/hangouts.svg'    , 512)
        .icon('twitter'    , '../images/svg/twitter.svg'     , 512)
        .icon('phone'      , '../images/svg/phone.svg'       , 512);
    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        .accentPalette('teal')
        .warnPalette('red')
        .backgroundPalette('grey');
})
.run(['$rootScope', function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === 'AUTH_REQUIRED') {
            console.log('authentication is required');
            $state.go('root.dashboard');
        } else {
            throw error;
        }
    });
}]);

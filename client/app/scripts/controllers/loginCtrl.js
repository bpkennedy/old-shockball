'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('LoginCtrl', function ($state, Auth) {
    var login = this;
    login.auth = Auth;
    login.auth.$onAuthStateChanged(function(authData) {
      login.authData = authData;
      console.log('auth changed has been called and is');
      console.log(login.authData);
    });
    login.signin = function() {
      login.auth.$signInWithEmailAndPassword(login.email, login.password)
      .then(function(authData) {
        console.log('Logged in as:', authData.uid);
        $state.go('root.dashboard');
      })
      .catch(function(err) {
        console.log('error:',err);
        //$state.go('login');
      });
    };
    login.signOut = function() {
        login.auth.$signOut().then(function(response) {
            console.log(response);
            console.log('signed out with ' + response);
        });
    };
});

'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('LoginCtrl', function ($scope, auth, currentUser) {
    var vm = this;
    vm.message = null;
    vm.error = null;
    vm.email = null;
    vm.password = null;
    vm.handle = null;
    vm.loggedInUser = null;
    vm.createUser = createUser;
    vm.deleteUser = deleteUser;
    vm.signIn = signIn;
    vm.signOut = signOut;
    vm.updateEmail = updateEmail;
    vm.updatePassword = updatePassword;
    vm.getUserToken = getUserToken;

    function init() {
        setUser();
    }

    function setUser() {
        if (currentUser) {
            vm.loggedInUser = currentUser;
        }
    }

    function signIn() {
        clearValidation();

        // Sign in with email/password
        auth.$signInWithEmailAndPassword(vm.email, vm.password)
        .then(function(firebaseUser) {
            vm.email = null;
            vm.password = null;
            vm.message = "User signed in as: " + firebaseUser.email;
        }).catch(function(error) {
            vm.error = "Error: " + error;
        });
    }

    function signOut() {
        clearValidation();

        // Sign out.  Null is returned
        auth.$signOut();
        $scope.$applyAsync();
        if (!currentUser) {
            vm.message = "User signed out.";
        } else {
            vm.error = "Something went wrong, failed to sign out.";
        }
    }

    function updateEmail() {
        clearValidation();
        auth.$updateEmail(vm.email).then(function() {
            vm.message = "Email changed successfully!";
        }).catch(function(error) {
            vm.error = "Error: " + error;
        });
    }

    function updatePassword() {
        clearValidation();
        auth.$updatePassword(vm.password).then(function() {
            vm.message = "Password changed successfully!";
        }).catch(function(error) {
            vm.error = "Error: " + error;
        });
    }

    function createUser() {
        clearValidation();

        // Create a new user
        auth.$createUserWithEmailAndPassword(vm.email, vm.password)
        .then(function(firebaseUser) {
            vm.message = "User created with uid: " + firebaseUser.uid;
        }).catch(function(error) {
            vm.error = "Error: " + error;
        });
    }

    function deleteUser() {
        clearValidation();

        // Delete the currently signed-in user
        auth.$deleteUser().then(function() {
            vm.message = "User deleted";
        }).catch(function(error) {
            vm.error = "Error: " + error;
        });
    }

    function getUserToken() {
        auth.$getAuth().getToken(true).then(function(idToken) {
            vm.message = "User idToken is: " + idToken;
        }).catch(function(error) {
            vm.error = "Error: " + error;
        });
    }

    function clearValidation() {
        vm.message = null;
        vm.error = null;
    }

    auth.$onAuthStateChanged(function(firebaseUser) {
        vm.loggedInUser = firebaseUser;
    });

    init();

});

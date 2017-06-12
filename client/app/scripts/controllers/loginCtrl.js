'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('LoginCtrl', function ($scope, auth, currentUser, toaster) {
    var vm = this;
    vm.email = null;
    vm.password = null;
    vm.handle = null;
    vm.loggedInUser = null;
    // vm.createUser = createUser;
    // vm.deleteUser = deleteUser;
    vm.signIn = signIn;
    vm.signOut = signOut;
    // vm.updateEmail = updateEmail;
    // vm.updatePassword = updatePassword;
    // vm.getUserToken = getUserToken;

    function init() {
        setUser();
    }

    function setUser() {
        if (currentUser) {
            vm.loggedInUser = currentUser;
        }
    }

    function signIn() {
        // Sign in with email/password
        auth.$signInWithEmailAndPassword(vm.email, vm.password)
        .then(function(firebaseUser) {
            console.log('user has signed in and is: ');
            console.log(firebaseUser);
            vm.email = null;
            vm.password = null;
            toaster.pop({
                type: 'success',
                title: 'Welcome back',
                timeout: 3000
            });
        }).catch(function(error) {
            console.log(error);
            toaster.pop({
                type: 'error',
                title: 'Error: could not sign in',
                timeout: 3000
            });
        });
    }

    function signOut() {
        // Sign out.  Null is returned
        auth.$signOut();
        $scope.$applyAsync();
        if (!currentUser) {
            toaster.pop({
                type: 'success',
                title: 'Success',
                body: 'Signed out.',
                timeout: 3000
            });
        } else {
            toaster.pop({
                type: 'error',
                title: 'Error: Could not sign out',
                timeout: 3000
            });
        }
    }

    // function updateEmail() {
    //     auth.$updateEmail(vm.email).then(function() {
    //         vm.message = "Email changed successfully!";
    //     }).catch(function(error) {
    //         vm.error = "Error: " + error;
    //     });
    // }

    // function updatePassword() {
    //     auth.$updatePassword(vm.password).then(function() {
    //         vm.message = "Password changed successfully!";
    //     }).catch(function(error) {
    //         vm.error = "Error: " + error;
    //     });
    // }

    // function createUser() {
    //     // Create a new user
    //     auth.$createUserWithEmailAndPassword(vm.email, vm.password)
    //     .then(function(firebaseUser) {
    //         vm.message = "User created with uid: " + firebaseUser.uid;
    //     }).catch(function(error) {
    //         vm.error = "Error: " + error;
    //     });
    // }

    // function deleteUser() {
    //     // Delete the currently signed-in user
    //     auth.$deleteUser().then(function() {
    //         toaster.pop({
    //             type: 'success',
    //             title: 'User deleted',
    //             timeout: 3000
    //         });
    //     }).catch(function(error) {
    //         toaster.pop({
    //             type: 'error',
    //             title: 'Error: Could not delete user',
    //             timeout: 3000
    //         });
    //     });
    // }

    // function getUserToken() {
    //     auth.$getAuth().getToken(true).then(function(idToken) {
    //         console.log(idToken);
    //     }).catch(function(error) {
    //         toaster.pop({
    //             type: 'error',
    //             title: 'Error: Could not get user token',
    //             timeout: 3000
    //         });
    //     });
    // }

    auth.$onAuthStateChanged(function(firebaseUser) {
        vm.loggedInUser = firebaseUser;
    });

    init();

});

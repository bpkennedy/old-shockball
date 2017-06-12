'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:SignupCtrl
* @description
* # SignupCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('SignupCtrl', function ($rootScope, $window, $state, auth, toaster) {
    var vm = this;
    vm.email = null;
    vm.password = null;
    vm.passwordConfirm = null;
    vm.handle = null;
    vm.createUser = createUser;

    function createUser() {
        if (vm.password === vm.passwordConfirm) {
            // Create a new user
            auth.$createUserWithEmailAndPassword(vm.email, vm.password)
            .then(function(firebaseUser) {
                updateAccountName();
                createProfile(firebaseUser);
                $state.go('root.dashboard');
            }).catch(function(error) {
                console.log(error);
                toaster.pop({
                    type: 'error',
                    title: 'Error: User could not be created.',
                    timeout: 3000
                });
            });
        } else {
            toaster.pop({
                type: 'error',
                title: 'Passwords do not match',
                timeout: 3000
            });
        }
    }

    function updateAccountName() {
        var rawAuth = $window.firebase.auth().currentUser;
        rawAuth.updateProfile({
            displayName: vm.handle
        }).then(function() {
            //nothing needed
        }).catch(function(error) {
            console.log(error);
            toaster.pop({
                type: 'error',
                title: 'Error updating user display name.',
                timeout: 3000
            });
        });
    }

    function createProfile(user) {
        var users = $window.firebase.database().ref('users');
        var date = new Date().toJSON();
        users.child(user.uid).set({
            uid: user.uid,
            handle: vm.handle,
            email: user.email,
            created: date
        }).then(function() {
            toaster.pop({
                type: 'success',
                title: 'User profile created',
                timeout: 3000
            });
        });
    }

});

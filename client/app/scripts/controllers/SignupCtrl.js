'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:SignupCtrl
* @description
* # SignupCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('SignupCtrl', function ($rootScope, $window, $state, auth, loaderSvc) {
    var vm = this;
    vm.email = null;
    vm.password = null;
    vm.passwordConfirm = null;
    vm.handle = null;
    vm.createUser = createUser;

    function createUser() {
        if (vm.password === vm.passwordConfirm) {
            loaderSvc.toggleOn();
            // Create a new user
            auth.$createUserWithEmailAndPassword(vm.email, vm.password)
            .then(function(firebaseUser) {
                updateAccountName();
                createProfile(firebaseUser);
                $state.go('root.dashboard');
            }).catch(function(error) {
                $window.iziToast.error({
                    icon: 'fa fa-warning',
                    message: error
                });
                loaderSvc.toggleOff();
            });
        } else {
            $window.iziToast.warning({
                title: 'Warning',
                icon: 'fa fa-exclamation-circle',
                message: 'Passwords do not match.'
            });
        }
    }

    function updateAccountName() {
        var rawAuth = $window.firebase.auth().currentUser;
        rawAuth.updateProfile({
            displayName: vm.handle
        }).then(function() {
            //nothing needed
            loaderSvc.toggleOff();
        }).catch(function() {
            $window.iziToast.error({
                title: 'Warning',
                icon: 'fa fa-warning',
                message: 'Could not update user display name.'
            });
            loaderSvc.toggleOff();
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
            $window.iziToast.success({
                title: 'OK',
                icon: 'fa fa-thumbs-o-up',
                message: 'User profile created'
            });
            loaderSvc.toggleOff();
        }).catch(function(error) {
            $window.iziToast.error({
                icon: 'fa fa-warning',
                message: error
            });
            loaderSvc.toggleOff();
        });
    }

});

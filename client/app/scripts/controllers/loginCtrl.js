'use strict';

/**
* @ngdoc function
* @name shockballApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the shockballApp
*/
angular.module('shockballApp')
.controller('LoginCtrl', function ($window, $rootScope, $scope, auth, currentUser, loaderSvc, Events) {
    var vm = this;
    vm.email = null;
    vm.password = null;
    vm.handle = null;
    vm.loggedInUser = null;
    vm.pic = null;
    // vm.createUser = createUser;
    // vm.deleteUser = deleteUser;
    vm.signIn = signIn;
    vm.signOut = signOut;
    vm.updatePic = updatePic;
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
        loaderSvc.toggleOn();
        // Sign in with email/password
        auth.$signInWithEmailAndPassword(vm.email, vm.password)
        .then(function(firebaseUser) {
            vm.email = null;
            vm.password = null;
            $rootScope.$broadcast('login:signed in');
            $window.iziToast.info({
                icon: 'fa fa-info-circle',
                title: 'Yo, '  + firebaseUser.displayName,
                message: 'Train hard.  Git gud.',
                position: 'bottomCenter'
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

    function signOut() {
        var userTempHolder = angular.copy(vm.loggedInUser);
        // Sign out.  Null is returned
        auth.$signOut().then(function() {
            $window.iziToast.info({
                icon: 'fa fa-info-circle',
                message: 'Signed out',
                position: 'bottomCenter'
            });
            $rootScope.$broadcast('login:signed out', { user: userTempHolder });
        });
    }

    function updatePic() {
        var rawAuth = $window.firebase.auth().currentUser;
        if (vm.pic) {
            loaderSvc.toggleOn();
            rawAuth.updateProfile({
                photoURL: vm.pic
            }).then(function() {
                updateProfilePic(rawAuth);
            }).catch(function(error) {
                $window.iziToast.error({
                    icon: 'fa fa-warning',
                    message: error,
                });
                loaderSvc.toggleOff();
            });
        } else {
            $window.iziToast.warning({
                title: 'Warning',
                icon: 'fa fa-exclamation-circle',
                message: 'You must enter a url to change your picture.',
            });
        }
    }

    function updateProfilePic(user) {
        var users = $window.firebase.database().ref('users');
        users.child(user.uid).update({
            photoUrl: user.photoURL
        }).then(function(response) {
            console.log(response);
            updatePlayerPic(user.photoURL);
        }).catch(function(error) {
            $window.iziToast.error({
                icon: 'fa fa-warning',
                message: error,
            });
            loaderSvc.toggleOff();
        });
    }

    function updatePlayerPic(picUrl) {
        var eventToSend = {};
        eventToSend.actor = vm.loggedInUser.uid;
        eventToSend.type = 'picUpdate:' + picUrl;
        Events.create(eventToSend).then(function(response) {
            console.log(response);
            $window.iziToast.success({
                title: 'OK',
                icon: 'fa fa-thumbs-o-up',
                message: 'User and Player pic updated'
            });
            vm.pic = null;
            loaderSvc.toggleOff();
        }).catch(function (error) {
            $window.iziToast.error({
                icon: 'fa fa-warning',
                message: error,
                position: 'bottomCenter'
            });
            loaderSvc.toggleOff();
        });
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

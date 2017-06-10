'use strict';

/**
* @ngdoc service
* @name shockballApp.firebaseSvc
* @description
* # firebaseSvc
* Factory in the clientApp.
*/
angular.module('shockballApp')
.factory('firebaseSvc', function ($window) {
    var instance,
        storageInstance,
        unsubscribe,
        currentUser = null;

    return {
        initialize: function () {

            // Not initialized so... initialize Firebase
            var config = {
                apiKey: "AIzaSyAoRAWmkrHNtwNU7tlTpHSSyLNnEM-ra7c",
                authDomain: "swc-shockball.firebaseapp.com",
                databaseURL: "https://swc-shockball.firebaseio.com",
                projectId: "swc-shockball",
                storageBucket: "swc-shockball.appspot.com",
                messagingSenderId: "340439818243"
            };

            // initialize database and storage
            instance = $window.firebase.initializeApp(config);
            storageInstance = $window.firebase.storage();

            // listen for authentication event, dont start app until I
            // get either true or false
            unsubscribe = $window.firebase.auth().onAuthStateChanged(function (user) {
                currentUser = user;
            });
        }
    };
});

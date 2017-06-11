'use strict';

/**
 * @ngdoc function
 * @name shockballApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the shockballApp
 */
angular.module('shockballApp')
  .controller('SignupCtrl', function ($state, auth) {
      var vm = this;
      vm.message = null;
      vm.error = null;
      vm.email = null;
      vm.password = null;
      vm.passwordConfirm = null;
      vm.handle = null;
      vm.createUser = createUser;

      function createUser() {
          clearValidation();
          if (vm.password === vm.passwordConfirm) {
              // Create a new user
              auth.$createUserWithEmailAndPassword(vm.email, vm.password)
              .then(function(firebaseUser) {
                  vm.message = "User created with uid: " + firebaseUser.uid;
                  $state.go('root.dashboard');
              }).catch(function(error) {
                  vm.error = "Error: " + error;
              });
          } else {
              vm.error = "Your passwords do not match.";
          }
      }

      function clearValidation() {
          vm.message = null;
          vm.error = null;
      }

  });

'use strict';

/**
 * @ngdoc function
 * @name shockballApp.controller:ForgotpasswordCtrl
 * @description
 * # ForgotpasswordCtrl
 * Controller of the shockballApp
 */
angular.module('shockballApp')
  .controller('ForgotpasswordCtrl', function ($state, auth) {
      var vm = this;
      vm.email = null;
      vm.message = null;
      vm.error = null;
      vm.updatePassword = updatePassword;

      function updatePassword() {
          clearValidation();
          auth.$sendPasswordResetEmail(vm.email).then(function() {
              vm.message = "Password changed successfully!";
              $state.go('root.dashboard');
          }).catch(function(error) {
              vm.error = "Error: " + error;
          });
      }

      function clearValidation() {
          vm.message = null;
          vm.error = null;
      }

  });

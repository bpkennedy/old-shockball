'use strict';

/**
 * @ngdoc function
 * @name shockballApp.controller:ForgotpasswordCtrl
 * @description
 * # ForgotpasswordCtrl
 * Controller of the shockballApp
 */
angular.module('shockballApp')
  .controller('ForgotpasswordCtrl', function ($state, auth, toaster) {
      var vm = this;
      vm.email = null;
      vm.updatePassword = updatePassword;

      function updatePassword() {
          auth.$sendPasswordResetEmail(vm.email).then(function() {
              toaster.pop({
                  type: 'success',
                  title: 'Reset email sent',
                  timeout: 3000
              });
              $state.go('root.dashboard');
          }).catch(function(error) {
              console.log(error);
              toaster.pop({
                  type: 'error',
                  title: 'Error: Password did not update, no email sent.',
                  timeout: 3000
              });
          });
      }

  });

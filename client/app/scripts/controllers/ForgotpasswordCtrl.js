'use strict';

/**
 * @ngdoc function
 * @name shockballApp.controller:ForgotpasswordCtrl
 * @description
 * # ForgotpasswordCtrl
 * Controller of the shockballApp
 */
angular.module('shockballApp')
  .controller('ForgotpasswordCtrl', function ($window, $state, auth) {
      var vm = this;
      vm.email = null;
      vm.updatePassword = updatePassword;

      function updatePassword() {
          auth.$sendPasswordResetEmail(vm.email).then(function() {
              $window.iziToast.success({
                  title: 'OK',
                  icon: 'fa fa-thumbs-o-up',
                  message: 'Reset email sent'
              });
              $state.go('root.dashboard');
          }).catch(function(error) {
              console.log(error);
              $window.iziToast.error({
                  icon: 'fa fa-warning',
                  message: error,
              });
          });
      }

  });

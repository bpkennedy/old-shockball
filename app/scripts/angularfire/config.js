angular.module('firebase.config', [])
  .constant('FBURL', 'https://shockball-87ba3.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password'])

  .constant('loginRedirectPath', '/login');

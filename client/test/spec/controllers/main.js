'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('shockballApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should exist', function () {
  //    expect(MainCtrl).toBeDefined();
  // });
  //
  // it('should expect a scope var called test to be string test', function () {
  //     expect(MainCtrl.test).toBe('test');
  // });

});

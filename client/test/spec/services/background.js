'use strict';

describe('Service: background', function () {

  // load the service's module
  beforeEach(module('shockballApp'));

  // instantiate service
  var background;
  beforeEach(inject(function (_background_) {
    background = _background_;
  }));

  it('should do something', function () {
    expect(!!background).toBe(true);
  });

});

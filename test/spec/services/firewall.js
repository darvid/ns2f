'use strict';

describe('Service: firewall', function () {

  // load the service's module
  beforeEach(module('projectsApp'));

  // instantiate service
  var firewall;
  beforeEach(inject(function (_firewall_) {
    firewall = _firewall_;
  }));

  it('should do something', function () {
    expect(!!firewall).toBe(true);
  });

});

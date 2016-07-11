'use strict';

const expect = require('chai').expect;

describe('React Interceptor Helper Tests', function() {
  const monocleHook = require('../reactInterceptor.js');

  it('should return a valid function', function() {
    expect(monocleHook).to.be.a('function');
  });

  it('should execute callback provided when calling function closure', function() {
    const callback = function() {
      this.counter++;
    };
    callback.counter = 0;

    const hookedCallback = monocleHook(callback);
    hookedCallback();
    expect(callback.counter).to.equal(1);
  });
});
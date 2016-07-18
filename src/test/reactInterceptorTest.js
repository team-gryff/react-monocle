'use strict';

const expect = require('chai').expect;

describe('React Interceptor Helper Tests', function() {
  const monocleHook = require('../reactInterceptor.js').reactInterceptor;
  const initialStateWrapper = require('../reactInterceptor.js').grabInitialState;

  it('monocleHook should return a valid function', function() {
    expect(monocleHook).to.be.a('function');
  });

  it('monocleHook should execute callback provided when calling function closure', function() {
    const callback = function() {
      this.counter++;
    };
    callback.counter = 0;

    const hookedCallback = monocleHook(callback);
    hookedCallback();
    expect(callback.counter).to.equal(1);
  });

  it('initialStateWrapper should be a function', function() {
    expect(initialStateWrapper).to.be.a('function');
  });

  
});
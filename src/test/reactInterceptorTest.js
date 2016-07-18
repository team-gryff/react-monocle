'use strict';

const expect = require('chai').expect;

describe('React Interceptor Helper Tests', function() {
  const monocleHook = require('../reactInterceptor.js').reactInterceptor;
  const initialStateWrapper = require('../reactInterceptor.js').grabInitialState;

  it('monocleHook should return a valid function', function() {
    expect(monocleHook).to.be.a('function');
  });


  it('should update mocked react component\'s state property', function() {
    const MockReactComponent = {
      state: { },
      setState: function(newState, callback) {
        this.state = Object.assign(this.state, newState);
        if (callback) callback();
      }
    };
    
    const hijackedSetState = monocleHook('App', MockReactComponent);
    hijackedSetState({ name: 'John' });
    expect(MockReactComponent.state).to.deep.equal({ name: 'John' });
  });

  it('initialStateWrapper should be a function', function() {
    expect(initialStateWrapper).to.be.a('function');
  });

  
});
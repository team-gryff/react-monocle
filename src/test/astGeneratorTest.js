'use strict';
const expect = require('chai').expect;
const es5Component = __dirname + '/fixtures/test_components/Foo_es5.jsx';
const es6Component = __dirname + '/fixtures/test_components/Foo_es6.jsx';
const ReactDOMRender = __dirname + '/fixtures/test_components/ReactDOMRender.jsx';
const astGenerator = require('../astGenerator');

describe('astGenerator Tests for ES5 Components', function() {

  it('should be a function', function() {
    expect(astGenerator).to.be.a.function;
  })

  it('should return an object', function() {
    expect(astGenerator(es5Component)).to.be.an('object')
  })

  it('should return an object with one key', function() {
    expect(Object.keys(astGenerator(es5Component)).length).to.equal(1);
  })

  it('should have key based on export name', function() {
    expect(astGenerator(es5Component).hasOwnProperty('Foo')).to.be.true;
  })

})

describe('astGenerator Tests for ES6 Components', function() {

  it('should be a function', function() {
    expect(astGenerator).to.be.a.function;
  })

  it('should return an object', function() {
    expect(astGenerator(es6Component)).to.be.an('object')
  })

  it('should return an object with one key', function() {
    expect(Object.keys(astGenerator(es6Component)).length).to.equal(1);
  })

  it('should have key based on export name', function() {
    expect(astGenerator(es6Component).hasOwnProperty('Foo')).to.be.true;
  })

})

describe('astGenerator Tests to find entry', function() {
  it('should return an object', function() {
    expect(astGenerator(ReactDOMRender)).to.be.an('object');
  })

  it('should return an object with one key', function() {
    expect(Object.keys(astGenerator(ReactDOMRender)).length).to.equal(1);
  })

  it('should have key called "ENTRY', function() {
    expect(astGenerator(ReactDOMRender).hasOwnProperty('ENTRY')).to.be.true;
  })
})
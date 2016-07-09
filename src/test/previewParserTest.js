'use strict';

const expect = require('chai').expect;

describe('ReactApp AST Parser Tests', function() {
  const injectWrapper = require('../previewParser.js').injectWrapper;
  const updateMount = require('../previewParser.js').updateMount;
  let previewParserFixtures = require('./fixtures/bundleFileFixture.js');

  it('injectWrapper should be a function', function() {
    expect(injectWrapper).to.be.a.function;
  });

  it('injectWrapper should throw error when parser receives empty js code string', function() {
    expect(injectWrapper.bind(injectWrapper,'')).to.throw(Error, /Empty AST input/); 
  });

  it('injectWrapper should return a string', function() {
      expect(injectWrapper(previewParserFixtures.bundledSetState))
        .to.equal(previewParserFixtures.wrappedFunction);
  });

  it('updateMount should be a function', function() {
    expect(updateMount).to.be.a.function;
  });

  it('updateMount should throw error when parser receives empty js code string', function() {
    expect(updateMount.bind(updateMount, '')).to.throw(Error, /Empty AST input/);
  })

  it('updateMount should return a string', function() {
    expect(updateMount(previewParserFixtures.bundledGetElement)).to.equal(previewParserFixtures.newMount);
  })

})
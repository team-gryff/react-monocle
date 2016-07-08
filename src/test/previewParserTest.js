'use strict';

const expect = require('chai').expect;

describe('ReactApp AST Parser Tests', function() {
  const injectWrapper = require('../previewParser.js').injectWrapper;
  let previewParserFixtures = require('./fixtures/bundleFileFixture.js');

  it('injectWrapper should be a function', function() {
    expect(injectWrapper).to.be.a.function;
  });

  it('should throw error when parser receives empty js code string', function() {
    expect(injectWrapper.bind(injectWrapper,'')).to.throw(Error, /Empty AST input/); 
  });

  it('should return string', function() {
      expect(injectWrapper(previewParserFixtures.bundledSetState))
        .to.equal(previewParserFixtures.wrappedFunction);
  });
})
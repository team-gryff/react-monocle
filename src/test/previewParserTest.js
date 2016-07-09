'use strict';

const expect = require('chai').expect;

describe('ReactApp AST Parser Tests', function() {
  const modifyTestBundleFile = require('../previewParser.js').modifyTestBundleFile;
  let previewParserFixtures = require('./fixtures/bundleFileFixture.js');

  it('modifyTestBundleFile should be a function', function() {
    expect(modifyTestBundleFile).to.be.a.function;
  });

  it('modifyTestBundleFile should throw error when parser receives empty js code string', function() {
    expect(modifyTestBundleFile.bind(modifyTestBundleFile,'')).to.throw(Error, /Empty AST input/); 
  });

  it('modifyTestBundleFile should return a string', function() {
      expect(modifyTestBundleFile(previewParserFixtures.bundledSetState))
        .to.equal(previewParserFixtures.modifiedBundle);
  });

})
'use strict';

const expect = require('chai').expect;
const fs = require('fs');

describe('ReactApp AST Parser Tests', function() {
  const previewParserFixtures = require('./fixtures/bundleFileFixture.js');
  const modifySetStateStrings = require('../previewParser.js').modifySetStateStrings;
  const modifyInitialState = require('../previewParser.js').modifyInitialState;

  it('modifySetStateStrings should be a function', function() {
    expect(modifySetStateStrings).to.be.a.function;
  });

  it('modifySetStateStrings should throw error when parser receives invalid file path', function() {
    expect(modifySetStateStrings.bind(modifySetStateStrings, ''))
      .to.throw(Error, /Invalid bundle file path specified. Please enter a valid path to your app\'s bundle file/);
  });

  it('modifySetStateStrings should return a string', function(done) {
    expect(modifySetStateStrings(__dirname + '/fixtures/modifySetStateStringsInputFixture.js').length)
      .to.equal(fs.readFileSync(__dirname + '/fixtures/modifySetStateStringsOutputFixture.js', { encoding: 'utf-8' }).length);
    done();
  });

  it('modifyInitialState should be a function', function() {
    expect(modifyInitialState).to.be.a.function;
  });

  xit('modifyInitialState should return a string', function() {
    expect(modifyInitialState(fs.readFileSync(__dirname + '/fixtures/modifySetStateStringsInputFixture.js', { encoding: 'utf-8' })).length)
      .to.equal(fs.readFileSync(__dirname + '/fixtures/modifyInitialStateOutputFixture.js').length)
  })

  describe('getComponentName Tests', function() {
    const getComponentName = require('../previewParser.js').getComponentName;

    it('should return a valid function', function() {
      expect(getComponentName).to.be.a('function');
    });

    it('should return a component name for ES6 using Component', function() {
      const bundle = 'App=function(_Component)';
      expect(getComponentName(bundle, bundle.length)).to.equal('App');
    });

    it('should return a component name for ES6 using React.Component', function() {
      const bundle = 'Base=function(_React$Component)';
      expect(getComponentName(bundle, bundle.length)).to.equal('Base');
    });

    it('should return a component name for ES5 using React.createClass with spaces', function() {
      const bundle = 'var Node = (324, _react.createClass)';
      expect(getComponentName(bundle, bundle.length)).to.equal('Node');
    });
  })
})

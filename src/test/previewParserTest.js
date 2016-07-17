'use strict';

const expect = require('chai').expect;
const fs = require('fs');

describe('ReactApp AST Parser Tests', function() {
  const modifyTestBundleFile = require('../previewParser.js').modifyTestBundleFile;
  const structureES5Obj = require('../previewParser.js').structureInitialES5StateObj;
  const structureES6Obj = require('../previewParser.js').structureInitialES6StateObj;
  const queryES5Ast = require('../previewParser.js').queryES5Ast;
  const queryES6Ast = require('../previewParser.js').queryES6Ast;
  const previewParserFixtures = require('./fixtures/bundleFileFixture.js');
  
  const modifySetStateStrings = require('../previewParser.js').modifySetStateStrings;

  it('modifySetStateStrings should be a function', function() {
    expect(modifySetStateStrings).to.be.a.function;
  });

  it('modifySetStateStrings should throw error when parser receives empty js code string', function() {
    expect(modifySetStateStrings.bind(modifySetStateStrings,'')).to.throw(Error, /Bundle string is empty, provide valid bundle string input/); 
  });

  it('modifySetStateStrings should return a string', function() {
      expect(modifySetStateStrings(previewParserFixtures.bundledSetState))
        .to.equal(previewParserFixtures.modifiedBundle);
  });

  it('structureES5Obj should be a function', function() {
    expect(structureES5Obj).to.be.a.function;
  });


  it('structureES6Obj should be a function', function() {
    expect(structureES6Obj).to.be.a.function;
  });

  it('queryES5Ast should be a function', function() {
    expect(queryES5Ast).to.be.a.function;
  });

  it('queryES5Ast should throw error when it receives empty bundle file path', function() {
    expect(queryES5Ast.bind(queryES5Ast, '')).to.throw(Error, /Empty bundle file input/); 
  });


   it('queryES6Ast should be a function', function() {
    expect(queryES6Ast).to.be.a.function;
  });

  it('queryES6Ast should throw error when it receives empty bundle file path', function() {
    expect(queryES6Ast.bind(queryES6Ast, '')).to.throw(Error, /Empty bundle file input/); 
  });

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

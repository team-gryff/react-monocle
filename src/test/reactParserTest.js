'use strict';

const expect = require('chai').expect;

describe('ESTree AST Parser Tests', function() {
  const jsToAst = require('../reactParser.js').jsToAst;

  it('jsToAst should be a function', function() {
    expect(jsToAst).to.be.a.function;
  });

  it('should throw error when parser receives empty js code string', function() {
    expect(jsToAst.bind(jsToAst,'')).to.throw(Error, /Empty AST input/);
  });

  describe('ES5 React Component Parsing Tests', function() {
    const getES5ReactComponents = require('../reactParser.js').getES5ReactComponents;
    const es5ParserFixtures = require('./fixtures/es5ReactComponentFixtures.js');

    it('getES5ReactComponents should be a function', function() {
      expect(getES5ReactComponents).to.be.a.function;
    });

    it('should return object with \'Main\' as top-level component with child property containing array with single object with name property equal \'SearchBar\'', function() {
      expect(getES5ReactComponents(jsToAst(es5ParserFixtures.nestedComponents)))
        .to.deep.equal(es5ParserFixtures.nestedComponentsOutput);
    });

    it('should return object with props property', function() {
      expect(getES5ReactComponents(jsToAst(es5ParserFixtures.componentWithProps)))
        .to.deep.equal(es5ParserFixtures.componentWithPropsOutput);
    });

    it('should return object with state property', function() {
      expect(getES5ReactComponents(jsToAst(es5ParserFixtures.componentWithState)))
        .to.deep.equal(es5ParserFixtures.componentWithStateOutput);
    });

    it('should return object with methods property', function() {
      expect(getES5ReactComponents(jsToAst(es5ParserFixtures.componentWithMethods)))
        .to.deep.equal(es5ParserFixtures.componentWithMethodsOutput);
    });
  });

  describe('ES6 React Component Parsing Tests', function() {
    const getES6ReactComponents = require('../reactParser.js').getES6ReactComponents;
    const es6ParserFixtures = require('./fixtures/es6ReactComponentFixtures.js');

    it('should return object with name of top-level components in js file using es6', function() {
      expect(getES6ReactComponents(jsToAst(es6ParserFixtures.singleMainApp)))
        .to.deep.equal(es6ParserFixtures.singleMainAppOutput);
    });

    it('should return object with \'Main\' as top-level component with nested children components', function() {
     expect(getES6ReactComponents(jsToAst(es6ParserFixtures.nestedComponents)))
      .to.deep.equal(es6ParserFixtures.nestedComponentsOutput);
    });

    it('should return object with props property', function() {
      expect(getES6ReactComponents(jsToAst(es6ParserFixtures.componentWithProps)))
        .to.deep.equal(es6ParserFixtures.componentWithPropsOutput);
    });

    it('should return object with state property', function() {
      expect(getES6ReactComponents(jsToAst(es6ParserFixtures.componentWithState)))
        .to.deep.equal(es6ParserFixtures.componentWithStateOutput);
    });

    it('should return object with methods property', function() {
      expect(getES6ReactComponents(jsToAst(es6ParserFixtures.componentWithMethods)))
        .to.deep.equal(es6ParserFixtures.componentWithMethodsOutput);
    });
  });

  describe('ES6 Stateless Functional Component Parsing Tests', function() {
    
  })
});
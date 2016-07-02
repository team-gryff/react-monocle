'use strict';

const expect = require('chai').expect;

describe('ESTree AST Parser Tests', function() {
  const jsToAst = require('../reactParser.js').jsToAst;
  let reactParserOutputFixtures = require('./fixtures/reactParserOutputFixtures.js');

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
        .to.deep.equal(reactParserOutputFixtures.nestedComponentsOutput);
    });

    it('should return object with props property', function() {
      expect(getES5ReactComponents(jsToAst(es5ParserFixtures.componentWithProps)))
        .to.deep.equal(reactParserOutputFixtures.componentWithPropsOutput);
    });

    it('should return object with state property', function() {
      expect(getES5ReactComponents(jsToAst(es5ParserFixtures.componentWithState)))
        .to.deep.equal(reactParserOutputFixtures.componentWithStateOutput);
    });

    it('should return object with methods property', function() {
      expect(getES5ReactComponents(jsToAst(es5ParserFixtures.componentWithMethods)))
        .to.deep.equal(reactParserOutputFixtures.componentWithMethodsOutput);
    });
  });

  describe('ES6 React Component Parsing Tests', function() {
    const getES6ReactComponents = require('../reactParser.js').getES6ReactComponents;
    const es6ParserFixtures = require('./fixtures/es6ReactComponentFixtures.js');

    it('should return object with name of top-level components in js file using es6', function() {
      expect(getES6ReactComponents(jsToAst(es6ParserFixtures.singleMainApp)))
        .to.deep.equal(reactParserOutputFixtures.singleMainAppOutput);
    });

    it('should return object with \'Main\' as top-level component with nested children components', function() {
     expect(getES6ReactComponents(jsToAst(es6ParserFixtures.nestedComponents)))
      .to.deep.equal(reactParserOutputFixtures.nestedComponentsOutput);
    });

    it('should return object with props property', function() {
      expect(getES6ReactComponents(jsToAst(es6ParserFixtures.componentWithProps)))
        .to.deep.equal(reactParserOutputFixtures.componentWithPropsOutput);
    });

    it('should return object with state property', function() {
      expect(getES6ReactComponents(jsToAst(es6ParserFixtures.componentWithState)))
        .to.deep.equal(reactParserOutputFixtures.componentWithStateOutput);
    });

    it('should return object with methods property', function() {
      expect(getES6ReactComponents(jsToAst(es6ParserFixtures.componentWithMethods)))
        .to.deep.equal(reactParserOutputFixtures.componentWithMethodsOutput);
    });
  });

  describe('ES6 Stateless Functional Component Parsing Tests', function() {
    const getStatelessFunctionalComponents = require('../reactParser').getStatelessFunctionalComponents;
    const statelessFuncFixtures = require('./fixtures/es6StatelessFunctionalComponentFixtures');

    it('should be a function', function() {
      expect(getStatelessFunctionalComponents).to.be.a.function;
    })

    it('should return an object with correct name property', function() {
      expect(getStatelessFunctionalComponents(jsToAst(statelessFuncFixtures.statelessNested)).name).to.equal('Foo');
    })

    it('should account for nested children components', function() {
      expect(getStatelessFunctionalComponents(jsToAst(statelessFuncFixtures.statelessNested)).children[0].name).to.equal('Bar');
    })

    it('should return an object with correct props', function(){
      expect(getStatelessFunctionalComponents(jsToAst(statelessFuncFixtures.statelessNested)).children[0].props.length).to.equal(1);
    })
  })

  describe('React JSX Component Composition Tests', function() {
    const getES5ReactComponents = require('../reactParser').getES5ReactComponents;
    const commonComponentFixtures = require('./fixtures/commonReactComponentFixtures.js');
    const reactParserOutputFixtures = require('./fixtures/reactParserOutputFixtures.js');

    it('should have getES5ReactComponents return as a valid function', function() {
      expect(getES5ReactComponents).to.be.a('function');
    });

    it('should have for loop construct in render return nested components', function() {
      const forLoopComponentFixture = commonComponentFixtures.forLoopComponentFixture;
      expect(getES5ReactComponents(forLoopComponentFixture))
        .to.deep.equal(reactParserOutputFixtures.nestedComponentCompositionOutput);
    });

    it('should have MAP construct in render return nested components', function() {
      const mapComponentFixture = commonComponentFixtures.mapComponentFixture;
      expect(getES5ReactComponents(mapComponentFixture))
        .to.deep.equal(reactParserOutputFixtures.nestedComponentCompositionOutput);
    });
  });
});
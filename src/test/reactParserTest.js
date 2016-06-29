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

    it('should return object with name of top-level components in js file es5', function() {
      jsToAst(es5ParserFixtures.singleMainApp);
      expect(getES5ReactComponents()).to.deep.equal({ name: 'Main' });
    });

    it('should return object with \'Main\' as top-level component with child property containing array with single object with name property equal \'SearchBar\'', function() {
      jsToAst(es5ParserFixtures.nestedComponents);
      expect(getES5ReactComponents()).to.deep.equal({ 
        name: 'Main',
        children: [
          { name: 'SearchBar', children: [] }, 
          { name: 'SearchResults',
            children: [
              { name: 'Result', children: [] }, 
              { name: 'Result', children: [] }
            ]
          }
        ],
      });
    });

    // it('should return object with props property', function() {
    //   jsTo
    // })
  });

  describe('ES6 React Component Parsing Tests', function() {
    const getES6ReactComponents = require('../reactParser.js').getES6ReactComponents;
    let es6Components = `
      class Main extends Component {}
    `;

    let es6NestedComponents = `
      class Main extends Component {
        render () {
          return <div>
            <SearchBar />
            <div>Testing</div>
            <SearchResults>
              <Result />
              <Result />
            </SearchResults>
          </div>
        }
      }
    `;

    it('should return object with name of top-level components in js file using es6', function() {
      jsToAst(es6Components);
      expect(getES6ReactComponents()).to.deep.equal({ name: 'Main' });
    });

    it('should return object with \'Main\' as top-level component with nested children components', function() {
      jsToAst(es6NestedComponents);
      expect(getES6ReactComponents()).to.deep.equal({ 
        name: 'Main',
        children: [
          { name: 'SearchBar', children: [] }, 
          { name: 'SearchResults',
            children: [
              { name: 'Result', children: [] }, 
              { name: 'Result', children: [] }
            ]
          }
        ],
      });
    });
  });
});
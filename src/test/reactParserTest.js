'use strict';

const expect = require('chai').expect;

describe('ESTree AST Parser Tests', function() {
  const jsToAst = require('../reactParser.js').jsToAst;
  const getES5ReactComponents = require('../reactParser.js').getES5ReactComponents;
  const getES6ReactComponents = require('../reactParser.js').getES6ReactComponents;

  let es5Components = `
    var Main = React.createClass({ });
    var App = React.createClass({ });
  `;

  let es6Components = `
    class Main extends Component {}
    class App extends React.Component {}
  `;

  it('jsToAst should be a function', function() {
    expect(jsToAst).to.be.a.function;
  });

  it('getES5ReactComponents should be a function', function() {
    expect(getES5ReactComponents).to.be.a.function;
  });

  it('should throw error when parser receives empty js code string', function() {
    expect(jsToAst.bind(jsToAst,'')).to.throw(Error, /Empty AST input/);
  });

  it('should return object with name of top-level components in js file es5', function() {
    jsToAst(es5Components);
    expect(getES5ReactComponents()).to.deep.equal([ { name: 'Main' }, { name: 'App' } ]);
  });

  it('should return object with name of top-level components in js file using es6', function() {
    jsToAst(es6Components);
    expect(getES6ReactComponents()).to.deep.equal([ { name: 'Main' }, { name: 'App' } ]);
  });
});
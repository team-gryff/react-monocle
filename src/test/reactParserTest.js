const expect = require('chai').expect;

describe('ESTree AST Parser Tests', function() {
  const jsToAstD3 = require('../reactParser.js');

  it('should be a function', function() {
    expect(jsToAstD3).to.be.a.function;
  });

  it('should throw error when parser receives empty js code string', function() {
    expect(jsToAstD3.bind(jsToAstD3,'')).to.throw(Error, /Empty AST input/);
  });

  it('should return array of all variable declarations in js code string', function() {
    expect(jsToAstD3(
    `var Main = React.createClass({
      render: function() {
        
      }
    });

    var App = React.createClass({
      render: function() {
        
      }
    });`)).to.deep.equal(['Main', 'App']);
  });
});
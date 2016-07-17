'use strict'
const expect = require('chai').expect;
const esquery = require('../../esquery/esquery');
const acorn = require('acorn-jsx');
const bfs = require('acorn-bfs');
const fixtures = require('./fixtures/commonReactComponentFixtures');
const reactParser = require('../reactParser');


describe('iterations', function() {
  const forLoopAST = acorn.parse(fixtures.forLoop, {
    plugins: { jsx: true },
  });
  const forLoop = esquery(forLoopAST, 'ForStatement').filter(ele => {
    const searched = bfs(ele).filter(n => {
      return n.type === 'JSXElement';
    });
    return searched.length > 0;
  });

  const forInAST = acorn.parse(fixtures.forIn, {
    plugins: { jsx: true },
  });
  const forIn = esquery(forInAST, 'ForInStatement').filter(ele => {
    const searched = bfs(ele).filter(n => {
      return n.type === 'JSXElement';
    });
    return searched.length > 0;
  });

  const mapAST = acorn.parse(fixtures.mapFunc, {
    plugins: { jsx: true },
  });
  const mapFunc = esquery(mapAST, 'CallExpression').filter(ele => {
    const searched = bfs(ele).filter(n => {
      return n.type === 'JSXElement';
    });
    return searched.length > 0;
  });


  it ('should do something with forIn', function() {
    const forInFinder = reactParser.forInFinder;
    console.log(forInFinder(forIn, 'test'));
  })

  it ('should do something with for loop', function() {
    const forLoopFinder = reactParser.forLoopFinder;
    console.log(forLoopFinder(forLoop, 'test'));
  })

  it('should do something with map', function() {
    const higherOrderFunctionFinder = reactParser.higherOrderFunctionFinder;
    console.log(higherOrderFunctionFinder(mapFunc, 'test'));
    console.log(higherOrderFunctionFinder(mapFunc, 'test')[0].jsx.props);
  })

})
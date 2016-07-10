'use strict';
const fs = require('fs');
const acorn = require('acorn');
const esquery = require('esquery');
const escodegen = require('escodegen');

function modifyBundleFile(bundlejs) {
  let bundle = fs.readFileSync(bundlejs, { encoding: 'utf-8' });
  if (bundle.length == 0) throw new Error('Empty AST input');
  const searchState = /this.setState/g;
  const wrappedFunc = 'wrapper(this.setState)';
  const searchElem = /(getElementById\([\'\"])\w+[\'\"]/;
  const newMount = 'getElementById("preview"';
  let replacedState = bundle.replace(searchState, wrappedFunc);
  return replacedState.replace(searchElem, newMount);
}

function getInitialStateVals(bundlejs) {
  let bundle = fs.readFileSync(bundlejs, { encoding: 'utf-8' });
  const ast = acorn.parse(bundle);
  if (ast.body.length === 0) throw new Error('Empty AST input');
  queryAst('[id.name="getInitialState"]', ast); 
}

function queryAst(string, ast) {
  let parseInfo = esquery.parse(string);
  let match = esquery.match(ast, parseInfo);
  let initialStates;
  let initialStatesArr = [];
  let parsedMatch = match.map(ele => {
    let astToES6 = escodegen.generate(ele.body.body[0].argument);
    eval(`initialStates = ${astToES6}`);
    initialStatesArr.push(initialStates);
  });
  return initialStatesArr;
}

function modifyTestBundleFile(bundle) {
  if (bundle.length == 0) throw new Error('Empty AST input');
  const searchState = /this.setState/g;
  const wrappedFunc = 'wrapper(this.setState)';
  const searchElem = /(getElementById\([\'\"])\w+[\'\"]/;
  const newMount = 'getElementById("preview"';
  let replacedState = bundle.replace(searchState, wrappedFunc);
  return replacedState.replace(searchElem, newMount);
}


module.exports = {
  modifyBundleFile,
  modifyTestBundleFile,
};


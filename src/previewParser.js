'use strict';
const fs = require('fs');
const acorn = require('acorn');
const esquery = require('esquery');
const escodegen = require('escodegen');
const regexLastIndexOf = require('./stringRegexHelper').regexLastIndexOf;

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

function getComponentName(bundle, startingIndex) {
  let bundleSearchIndicesMap = {};
  // get index of component declaration
  bundleSearchIndicesMap[regexLastIndexOf(bundle, /var \w+ = \(\d+, _react.createClass\)/, startingIndex)] = 'GULP';
  // let's try web pack...
  bundleSearchIndicesMap[regexLastIndexOf(bundle, /var \w+ = function \(_React\$Component\)/, startingIndex)] = 'WEBPACK';
  
  const targetIndex = Object.keys(bundleSearchIndicesMap)
  	.filter(index => index >= 0)
  	.reduce((prev, curr) => {
  	  return Math.abs(curr-startingIndex) < Math.abs(prev-startingIndex)
  	  	? curr
  	  	: prev;
  	});
 
  let componentMatch;
  switch(bundleSearchIndicesMap[targetIndex]) {
  	case 'GULP':
  	  componentMatch = bundle.slice(targetIndex)
  	  	.match(/var \w+ = \(\d+, _react.createClass\)/)
  	  break;
    case 'WEBPACK':
   	  componentMatch = bundle.slice(targetIndex)
  	    .match(/var \w+ = function \(_React\$Component\)/)
   	  break;
    default:
    	break;
  }
  return componentMatch[0].split(' ')[1];
}

module.exports = {
  modifyBundleFile,
  modifyTestBundleFile,
  modifySetStateStrings,
};


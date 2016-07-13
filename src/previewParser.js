'use strict';
const fs = require('fs');
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


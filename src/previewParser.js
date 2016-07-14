'use strict';
const fs = require('fs');
const regexLastIndexOf = require('./stringRegexHelper').regexLastIndexOf;
const strip = require('strip-comments');

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

function modifySetStateStrings(bundleFilePath) {
  let bundle = fs.readFileSync(bundleFilePath, { encoding: 'utf-8' });
  if (bundle.length == 0) throw new Error('Bundle string is empty, provide valid bundle string input');
  
  console.log('Starting to strip comments from bundle file...');
  const start = Date.now();
  let modifiedBundle = strip(bundle.slice());
  console.log(`Took ${(Date.now() - start) / 1000} seconds to strip comments input bundle file`);

  let index = modifiedBundle.indexOf('this.setState', 0);
  while (index !== -1) {
    let openBraceIdx = modifiedBundle.indexOf('{', index);
    let currentIdx = openBraceIdx + 1;
    const parensStack = ['{'];
    while (parensStack.length !== 0) {
      if (modifiedBundle[currentIdx] === '{') parensStack.push(modifiedBundle[currentIdx]);
      if (modifiedBundle[currentIdx] === '}') parensStack.pop();
      currentIdx++;
    }

    const injection = `wrapper(this.setState)(${ modifiedBundle.slice(openBraceIdx, currentIdx) }, '${getComponentName(modifiedBundle, index)}')`;
    modifiedBundle = modifiedBundle.slice(0, index) + injection + modifiedBundle.slice(currentIdx + 1);
    
    // need to take into account that length of bundle now changes since injected wrapper string length can be different than original
    const oldLength = currentIdx - index;
    const newLength = injection.length;
    
    index = modifiedBundle.indexOf('this.setState', index+1+newLength-oldLength);
  }

  return modifiedBundle;
}

module.exports = {
  modifyBundleFile,
  modifyTestBundleFile,
  modifySetStateStrings,
};


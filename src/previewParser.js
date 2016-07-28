'use strict';
const fs = require('fs');
const acorn = require('acorn');
const esquery = require('../esquery/esquery');
const regexIndexOf = require('./stringRegexHelper').regexIndexOf;
const regexLastIndexOf = require('./stringRegexHelper').regexLastIndexOf;
const strip = require('strip-comments');




function structureInitialES5StateObj(bundle, arr) {
  if (arr.length === 0) return {};
  let initialStateIndex = bundle.indexOf('getInitialState()', 0);
  const objForReduxStore = {};
  for (let i = 0; i < arr.length; i++) {
    const arrOfStateObjs = [];
    for (const key in arr[i]) {
      arrOfStateObjs.push({
        name: key,
        value: arr[i][key],
      });
      objForReduxStore[getComponentName(bundle, initialStateIndex)] = arrOfStateObjs;
    }
    initialStateIndex = bundle.indexOf('getInitialState()', initialStateIndex + 1);
  }
  return objForReduxStore;
}

function structureInitialES6StateObj(bundle, arr) {
  if (arr.length === 0) return {};
  let initialStateIndex = bundle.indexOf('_this.state', 0);
  const objForReduxStore = {};
  for (let i = 0; i < arr.length; i++) {
    const arrOfStateObjs = [];
    for (const key in arr[i]) {
      arrOfStateObjs.push({
        name: key,
        value: arr[i][key],
      });
      objForReduxStore[getComponentName(bundle, initialStateIndex)] = arrOfStateObjs;
    }
    initialStateIndex = bundle.indexOf('_this.state', initialStateIndex + 1);
  }
  return objForReduxStore;
}

/**
 * Queries ES5 AST for initial state values
 * @params {Bundlejs} File path for user's bundled React code
 * @returns {Object} Object of initial state key:value properties and it's 
 * parent component
 */
function queryES5Ast(bundlejs) {
  if (!bundlejs) throw new Error('Empty bundle file input');
  const bundle = fs.readFileSync(bundlejs, { encoding: 'utf-8' });
  const ast = acorn.parse(bundle);
  if (ast.body.length === 0) throw new Error('Empty AST input');
  const parseInfo = esquery.parse('[id.name="getInitialState"]');
  const match = esquery.match(ast, parseInfo);
  const finalStateArr = [];
  if (match.length === 0) return {};
  match.map(ele => {
    const valueObj = {};
    ele.body.body.map(index => {
      if (index.type === 'ReturnStatement') {
        index.argument.properties.map(node => {
          if (node.value.hasOwnProperty('value')) {
            valueObj[node.key.name] = node.value.value;
          } else if (node.value.hasOwnProperty('name')) {
            valueObj[node.key.name] = node.value.name;
          } else if (node.value.hasOwnProperty('elements')) {
            valueObj[node.key.name] = node.value.elements;
          }
        });
        finalStateArr.push(valueObj);
      }
    });
  });
  return structureInitialES5StateObj(bundlejs, finalStateArr);
}

/**
 * Queries ES6 AST for initial state values
 * @params {Bundlejs} File path for user's bundled React code
 * @returns {Object} Object of initial state key:value properties and it's 
 * parent component
 */
function queryES6Ast(bundlejs) {
  if (!bundlejs) throw new Error('Empty bundle file input');
  const bundle = fs.readFileSync(bundlejs, { encoding: 'utf-8' });
  const ast = acorn.parse(bundle);
  if (ast.body.length === 0) throw new Error('Empty AST input');
  const parseInfo = esquery.parse('ExpressionStatement');
  const match = esquery.match(ast, parseInfo);
  const finalStateArr = [];
  if (match.length === 0) return {};
  match.map(ele => {
    const valueObj = {};
    if (ele.expression.left) {
      if (ele.expression.left.object) {
        if (ele.expression.left.object.name === '_this') {
          const valueNode = ele.expression.right.properties;
          valueNode.map(node => {
            const finalValArr = [];
            if (node.value.elements) {
              node.value.elements.map(index => {
                finalValArr.push(index.value);
              });
            }
            valueObj[node.key.name] = node.value.value || finalValArr;
          });
          finalStateArr.push(valueObj);
        }
      }
    }
  });
  return structureInitialES6StateObj(bundle, finalStateArr);
}



function modifyTestBundleFile(bundle) {
  if (bundle.length === 0) throw new Error('Empty AST input');
  const searchState = /this.setState/g;
  const wrappedFunc = 'wrapper(this.setState)';
  const searchElem = /(getElementById\([\'\"])\w+[\'\"]/;
  const newMount = 'getElementById("preview"';
  const replacedState = bundle.replace(searchState, wrappedFunc);
  return replacedState.replace(searchElem, newMount);
}



function getComponentName(bundle, startingIndex) {
  let bundleSearchIndicesMap = {};
  // get index of component declaration
  bundleSearchIndicesMap[regexLastIndexOf(bundle, /(var )?\w+\s*?=\s*(\(\d+\, )?_react(\d+\[\"\w+\"\])?.createClass/, startingIndex)] = 'WEBPACKES5';
  // let's try ES6...
  bundleSearchIndicesMap[regexLastIndexOf(bundle, /(var )?\w+\s*?=\s*?function\s*?\(_(React\$)?Component\)/, startingIndex)] = 'WEBPACKES6';
  // let's try GULP
  bundleSearchIndicesMap[regexLastIndexOf(bundle, /var \w+ = React.createClass\({/, startingIndex)] = 'GULP';
  // let's try Rollup ex: var Slick = (function (superclass) {
  bundleSearchIndicesMap[regexLastIndexOf(bundle, /var \w+ = \(function \(superclass\) {/, startingIndex)] = 'ROLLUP';
  const targetIndex = Object.keys(bundleSearchIndicesMap)
  	.filter(index => index >= 0)
  	.reduce((prev, curr) => {
  	  return Math.abs(curr-startingIndex) < Math.abs(prev-startingIndex)
  	  	? curr
  	  	: prev;
  	});
 
  let componentMatch;
  switch(bundleSearchIndicesMap[targetIndex]) {
  	case 'WEBPACKES5':
  	  componentMatch = bundle.slice(targetIndex)
  	  	.match(/(var )?\w+\s*?=\s*(\(\d+\, )?_react(\d+\[\"\w+\"\])?.createClass/)
  	  break;
    case 'WEBPACKES6':
   	  componentMatch = bundle.slice(targetIndex)
  	    .match(/(var )?\w+\s*?=\s*?function\s*?\(_(React\$)?Component\)/)
   	  break;
    case 'GULP':
      componentMatch = bundle.slice(targetIndex)
        .match(/var \w+ = React.createClass\({/)
      break;
    case 'ROLLUP':
      componentMatch = bundle.slice(targetIndex)
        .match(/var \w+ = \(function \(superclass\) {/)
      break;
    default:
    	throw new Error('Unable to find component from bundle file');
  }

  // need to normalize component name (remove declarator ex. var, const)
  return componentMatch[0]
    .replace(/var |const /, '')
    .replace(/ /g, '')
    .split('=')[0];
}

function modifySetStateStrings(bundleFilePath) {
  let bundle;
  try {
    bundle = fs.readFileSync(bundleFilePath, { encoding: 'utf-8' });
  } catch(error) {
    throw new Error('Invalid bundle file path specified. Please enter a valid path to your app\'s bundle file');
  }

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
    const stateStr = modifiedBundle.slice(openBraceIdx, currentIdx);
    const functionStartIdx = currentIdx;
    parensStack.push('(');
    while (parensStack.length !== 0) {
      if (modifiedBundle[currentIdx] === '(') parensStack.push(modifiedBundle[currentIdx]);
      if (modifiedBundle[currentIdx] === ')') parensStack.pop();
      currentIdx++;
    }
    currentIdx--;
    const callbackStr = modifiedBundle.slice(functionStartIdx, currentIdx);
    const injection = `wrapper('${getComponentName(modifiedBundle, index)}',this)(${ stateStr }${ callbackStr })`;
    modifiedBundle = modifiedBundle.slice(0, index) + injection + modifiedBundle.slice(currentIdx + 1);
    // need to take into account that length of bundle now changes since injected wrapper string length can be different than original
    const oldLength = currentIdx - index;
    const newLength = injection.length;
    
    index = modifiedBundle.indexOf('this.setState', index+1+newLength-oldLength);
  }
  return modifiedBundle;
}


function modifyInitialState(modifiedBundle) {
  let index = -1;
  if (modifiedBundle.indexOf('_this.state') >= 0) {
    // do webpack
    index = modifiedBundle.indexOf('_this.state', 0);
  } else if (modifiedBundle.indexOf('getInitialState() {', 0) >= 0) {
    // do gulp
    index = modifiedBundle.indexOf('getInitialState() {', 0) + 19;
  } else if (modifiedBundle.indexOf('this.state', 0) >= 0) {
    // do rollup
    index = modifiedBundle.indexOf('this.state = {');
  } else {
    throw new Error('Unable to find component initial state');
  }

  while (index !== -1) {
    let openBraceIdx = modifiedBundle.indexOf('{', index); // looking for index of follow brace, after return statement
    let currentIdx = openBraceIdx + 1;
    const parensStack = ['{'];
    while (parensStack.length !== 0) {
      if (modifiedBundle[currentIdx] === '{') parensStack.push(modifiedBundle[currentIdx]);
      if (modifiedBundle[currentIdx] === '}') parensStack.pop();
      currentIdx++;
    }

    let injection,
        componentName = getComponentName(modifiedBundle, index),
        stateStr = modifiedBundle.slice(openBraceIdx, currentIdx);
    if (modifiedBundle.indexOf('_this.state', 0) >= 0) {
      injection = `_this.state = grabInitialState('${componentName}', ${stateStr}),`;
    } else if (modifiedBundle.indexOf('getInitialState() {', 0) >= 0) {
      injection = `return grabInitialState('${componentName}', ${stateStr}),`;
    } else if (modifiedBundle.indexOf('this.state = {', 0) >= 0) {
      injection = `this.state = grabInitialState('${componentName}', ${stateStr}),`;
    }

    modifiedBundle = modifiedBundle.slice(0, index) + injection + modifiedBundle.slice(currentIdx + 1);
    
    // need to take into account that length of bundle now changes since injected wrapper string length can be different than original
    const oldLength = currentIdx - index;
    const newLength = injection.length;
    
    if (modifiedBundle.indexOf('_this.state') >= 0) {
      index = modifiedBundle.indexOf('_this.state', index + 1 + newLength - oldLength);
    } else if (modifiedBundle.indexOf('getInitialState() {') >= 0) {
      index = modifiedBundle.indexOf('getInitialState() {', index + 1 + newLength - oldLength);
    } else if (modifiedBundle.indexOf('this.state = grabInitialState') >= 0) {
      index = modifiedBundle.indexOf('this.state = grabInitialState', index + 1 + newLength - oldLength);
    } else {
      throw new Error('Unable to find next initial state index');
    }
  }
  return modifiedBundle;
}


function getDivs(modifiedBundle) {
  let index = modifiedBundle.indexOf('getElementById(', 0);
  let divsArr = [];
  while (index !== -1) {
    let openParenIdx = modifiedBundle.indexOf('(', index - 1);
    let currentIdx = openParenIdx + 1;
    const parensStack = ['('];
    while (parensStack.length !== 0) {
      if (modifiedBundle[currentIdx] === '(') parensStack.push(modifiedBundle[currentIdx]);
      if (modifiedBundle[currentIdx] === ')') parensStack.pop();
      currentIdx++;
    }
    divsArr.push(modifiedBundle.slice(openParenIdx + 2, currentIdx - 2));
    index = modifiedBundle.indexOf('getElementById(', index + 1);
  }
  divsArr = divsArr.map(ele => {
    return `<div id='${ele}'></div>`;
  });
  const uniqueArr = [];
  for (let i = 0; i < divsArr.length; i++) {
    if (uniqueArr.indexOf(divsArr[i]) < 0) {
      uniqueArr.push(divsArr[i]);
    }
  }
  return uniqueArr;
}

module.exports = {
  structureInitialES5StateObj,
  structureInitialES6StateObj,
  queryES5Ast,
  queryES6Ast,
  modifyTestBundleFile,
  modifySetStateStrings,
  modifyInitialState,
  getComponentName,
  getDivs,
};


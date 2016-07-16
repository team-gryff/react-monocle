'use strict';
const fs = require('fs');
const acorn = require('acorn');
const esquery = require('esquery');
const regexLastIndexOf = require('./stringRegexHelper').regexLastIndexOf;
const strip = require('strip-comments');

/**
 * Alters user's bundled React code to wrap 'setState' functions in universal,
 * global function and updates 'getElementById' to mount to Monocle DOM
 * @param {bundlejs} filepath to user's bundled React code
 * @returns {String} String of updated bundle file
 */
function modifyBundleFile(bundlejs) {
  const bundle = fs.readFileSync(bundlejs, { encoding: 'utf-8' });
  if (bundle.length === 0) throw new Error('Empty AST input');
  const searchState = /this.setState/g;
  const wrappedFunc = 'wrapper(this.setState)';
  const searchElem = /(getElementById\([\'\"])\w+[\'\"]/;
  const newMount = 'getElementById("preview"';
  const replacedState = bundle.replace(searchState, wrappedFunc);
  return replacedState.replace(searchElem, newMount);
}


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
    initialStateIndex = bundle.indexOf('getInitialState()', initialStateIndex+1);
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
    initialStateIndex = bundle.indexOf('_this.state', initialStateIndex+1);
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
  bundleSearchIndicesMap[regexLastIndexOf(bundle, /var \w+ = \(\d+, _react.createClass\)/, startingIndex)] = 'GULP';
  // let's try web pack...
  bundleSearchIndicesMap[regexLastIndexOf(bundle, /(var )?\w+\s*=\s*function\s*\(_React\$Component\)/, startingIndex)] = 'WEBPACK';

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
  	    .match(/(var )?\w+\s*=\s*function\s*\(_React\$Component\)/)
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

    const componentName = getComponentName(modifiedBundle, index);
    const injection = `wrapper(this.setState)(${ modifiedBundle.slice(openBraceIdx, currentIdx) }, '${componentName}')`;
    modifiedBundle = modifiedBundle.slice(0, index) + injection + modifiedBundle.slice(currentIdx + 1);
    
    // need to take into account that length of bundle now changes since injected wrapper string length can be different than original
    const oldLength = currentIdx - index;
    const newLength = injection.length;
    
    index = modifiedBundle.indexOf('this.setState', index+1+newLength-oldLength);
  }

  return modifiedBundle;
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
  structureInitialES5StateObj,
  structureInitialES6StateObj,
  queryES5Ast,
  queryES6Ast,
  modifyBundleFile,
  modifyTestBundleFile,
  modifySetStateStrings,
  getComponentName,
};


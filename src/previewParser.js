'use strict';
const fs = require('fs');
const regexLastIndexOf = require('./stringRegexHelper').regexLastIndexOf;
const strip = require('strip-comments');

const WEBPACKES5 = /(var )?\w+\s*?=\s*(\(\d+, )?_react(\d+\["\w+"\])?.createClass/;
const WEBPACKES6 = /(var )?\w+\s*?=\s*?function\s*?\(_(React\$)?Component\)/;
const GULP = /var \w+ = React.createClass\({/;
const ROLLUP = /var \w+ = \(function \(superclass\) {/;

function getComponentName(bundle, startingIndex) {
  const bundleSearchIndicesMap = {};
  // get index of component declaration
  bundleSearchIndicesMap[regexLastIndexOf(bundle, WEBPACKES5, startingIndex)] = 'WEBPACKES5';
  // let's try ES6...
  bundleSearchIndicesMap[regexLastIndexOf(bundle, WEBPACKES6, startingIndex)] = 'WEBPACKES6';
  // let's try GULP
  bundleSearchIndicesMap[regexLastIndexOf(bundle, GULP, startingIndex)] = 'GULP';
  // let's try Rollup ex: var Slick = (function (superclass) {
  bundleSearchIndicesMap[regexLastIndexOf(bundle, ROLLUP, startingIndex)] = 'ROLLUP';
  const targetIndex = Object.keys(bundleSearchIndicesMap)
    .filter(index => index >= 0)
    .reduce((prev, curr) => {
      return Math.abs(curr - startingIndex) < Math.abs(prev - startingIndex)
      ? curr
      : prev;
    });

  let componentMatch;
  switch (bundleSearchIndicesMap[targetIndex]) {
    case 'WEBPACKES5':
      componentMatch = bundle.slice(targetIndex)
      .match(/(var )?\w+\s*?=\s*(\(\d+, )?_react(\d+\["\w+"\])?.createClass/);
      break;
    case 'WEBPACKES6':
      componentMatch = bundle.slice(targetIndex)
      .match(/(var )?\w+\s*?=\s*?function\s*?\(_(React\$)?Component\)/);
      break;
    case 'GULP':
      componentMatch = bundle.slice(targetIndex)
        .match(/var \w+ = React.createClass\({/);
      break;
    case 'ROLLUP':
      componentMatch = bundle.slice(targetIndex)
        .match(/var \w+ = \(function \(superclass\) {/);
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
  } catch (error) {
    throw new Error('Invalid bundle file path specified.' +
      ' Please enter a valid path to your app\'s bundle file');
  }

  if (bundle.length === 0) {
    throw new Error('Bundle string is empty, provide valid bundle string input');
  }

  console.log('Starting to strip comments from bundle file...');
  const start = Date.now();
  let modifiedBundle = strip(bundle.slice());
  console.log(`Took ${(Date.now() - start) / 1000} seconds to strip comments input bundle file`);
  let index = modifiedBundle.indexOf('this.setState', 0);
  while (index !== -1) {
    const openBraceIdx = modifiedBundle.indexOf('{', index);
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
    const injection = `wrapper('${getComponentName(modifiedBundle,
      index)}',this)(${stateStr}${callbackStr})`;
    modifiedBundle = modifiedBundle.slice(0, index) + injection
      + modifiedBundle.slice(currentIdx + 1);
    /* need to take into account that length of bundle now changes since injected wrapper
    string length can be different than original */
    const oldLength = currentIdx - index;
    const newLength = injection.length;
    index = modifiedBundle.indexOf('this.setState', index + 1 + newLength - oldLength);
  }
  return modifiedBundle;
}


function modifyInitialState(modifiedBundle) {
  let index = -1;
  let newModifiedBundle = modifiedBundle;
  if (newModifiedBundle.indexOf('_this.state') >= 0) {
    // do webpack
    index = newModifiedBundle.indexOf('_this.state', 0);
  } else if (newModifiedBundle.indexOf('getInitialState() {', 0) >= 0) {
    // do gulp
    index = newModifiedBundle.indexOf('getInitialState() {', 0) + 19;
  } else if (newModifiedBundle.indexOf('this.state', 0) >= 0) {
    // do rollup
    index = newModifiedBundle.indexOf('this.state = {');
  } else {
    throw new Error('Unable to find component initial state');
  }

  while (index !== -1) {
    // looking for index of follow brace, after return statement
    const openBraceIdx = newModifiedBundle.indexOf('{', index);
    let currentIdx = openBraceIdx + 1;
    const parensStack = ['{'];
    while (parensStack.length !== 0) {
      if (newModifiedBundle[currentIdx] === '{') parensStack.push(newModifiedBundle[currentIdx]);
      if (newModifiedBundle[currentIdx] === '}') parensStack.pop();
      currentIdx++;
    }

    let injection;
    const componentName = getComponentName(newModifiedBundle, index);
    const stateStr = newModifiedBundle.slice(openBraceIdx, currentIdx);
    if (newModifiedBundle.indexOf('_this.state', 0) >= 0) {
      injection = `_this.state = grabInitialState('${componentName}', ${stateStr}),`;
    } else if (newModifiedBundle.indexOf('getInitialState() {', 0) >= 0) {
      injection = `return grabInitialState('${componentName}', ${stateStr}),`;
    } else if (newModifiedBundle.indexOf('this.state = {', 0) >= 0) {
      injection = `this.state = grabInitialState('${componentName}', ${stateStr}),`;
    }

    newModifiedBundle = newModifiedBundle.slice(0, index) + injection
      + newModifiedBundle.slice(currentIdx + 1);
    /* need to take into account that length of bundle now changes since injected wrapper
    string length can be different than original */
    const oldLength = currentIdx - index;
    const newLength = injection.length;

    if (newModifiedBundle.indexOf('_this.state') >= 0) {
      index = newModifiedBundle.indexOf('_this.state', index + 1 + newLength - oldLength);
    } else if (newModifiedBundle.indexOf('getInitialState() {') >= 0) {
      index = newModifiedBundle.indexOf('getInitialState() {', index + 1 + newLength - oldLength);
    } else if (newModifiedBundle.indexOf('this.state = grabInitialState') >= 0) {
      index = newModifiedBundle.indexOf('this.state = grabInitialState',
        index + 1 + newLength - oldLength);
    } else {
      throw new Error('Unable to find next initial state index');
    }
  }
  return newModifiedBundle;
}


function getDivs(newModifiedBundle) {
  let index = newModifiedBundle.indexOf('getElementById(', 0);
  let divsArr = [];
  while (index !== -1) {
    const openParenIdx = newModifiedBundle.indexOf('(', index - 1);
    let currentIdx = openParenIdx + 1;
    const parensStack = ['('];
    while (parensStack.length !== 0) {
      if (newModifiedBundle[currentIdx] === '(') parensStack.push(newModifiedBundle[currentIdx]);
      if (newModifiedBundle[currentIdx] === ')') parensStack.pop();
      currentIdx++;
    }
    divsArr.push(newModifiedBundle.slice(openParenIdx + 2, currentIdx - 2));
    index = newModifiedBundle.indexOf('getElementById(', index + 1);
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
  modifySetStateStrings,
  modifyInitialState,
  getComponentName,
  getDivs,
};


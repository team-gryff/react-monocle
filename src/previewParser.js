'use strict';
const fs = require('fs');

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


module.exports = {
  modifyBundleFile,
  modifyTestBundleFile,
};


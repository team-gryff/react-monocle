'use strict';


function injectWrapper(bundlejs) {
  if (bundlejs.length === 0) throw new Error('Empty AST input');
  const searchStr = /this.setState/g;
  const wrappedFunc = 'wrapper(this.setState)';
  return bundlejs.replace(searchStr, wrappedFunc);
}


module.exports = {
  injectWrapper,
};
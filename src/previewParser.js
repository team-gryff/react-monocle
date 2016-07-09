'use strict';

let bundled = `(0, _reactDom.render)(_react2.default.createElement(
	  Frame,
	  null,
	  _react2.default.createElement(App, null)
		), document.getElementById('app'));`

function injectWrapper(bundlejs) {
  if (bundlejs.length === 0) throw new Error('Empty AST input');
  const searchStr = /this.setState/g;
  const wrappedFunc = 'wrapper(this.setState)';
  return bundlejs.replace(searchStr, wrappedFunc);
}

function updateMount(bundlejs) {
  if (bundlejs.length === 0) throw new Error('Empty AST input');
  const searchStr = /(getElementById\([\'\"])\w+[\'\"]/g;
  const newMount = 'getElementById("preview"';
  return bundlejs.replace(searchStr, newMount);
}

updateMount(bundled);

module.exports = {
  injectWrapper,
  updateMount,
};

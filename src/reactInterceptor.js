const monocleStore = require('../react/store/monocleStore');
const updateState = require('../react/actions/index');

const reactInterceptor = function(setStateFn, name) {
  return function(state, callback) {
    monocleStore.dispatch(updateState(name, state));
    return setStateFn.call(setStateFn, state, callback);
  };
};

module.exports = reactInterceptor;
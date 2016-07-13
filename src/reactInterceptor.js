const monocleStore = require('../react/store/monocleStore');
const updateState = require('../react/actions/index');

const DEVELOPMENT = true;

const reactInterceptor = function(setStateFn, name) {
  return function(state, callback) {
    // dispatch state to state container to update d3 tree
    //monocleStore.dispatch(updateState(name, state));
    return setStateFn.call(setStateFn, state, callback);
  };
};

module.exports = reactInterceptor;

if (DEVELOPMENT) {
  global.window = global;
}

window.wrapper = reactInterceptor;
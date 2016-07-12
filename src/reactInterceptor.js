const monocleStore = require('../react/store/monocleStore');
const updateState = require('../react/actions/index');

module.exports = window.wrapper = function(setStateFn, name) {
  return function(state, callback) {
    // dispatch state to state container to update d3 tree
    //monocleStore.dispatch(updateState(name, state));
    return setStateFn.call(setStateFn, state, callback);
  };
};
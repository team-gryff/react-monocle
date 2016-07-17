const monocleStore = require('../react/store/monocleStore');
const updateState = require('../react/actions/index');

module.exports = function(name, component) {
  return function(state, callback) {
    monocleStore.dispatch(updateState(name, state));
    return component.setState(state, callback);
  };
}
const monocleStore = require('../react/store/monocleStore');
const updateState = require('../react/actions/index').updateState;
const sendInitialState = require('../react/actions/index').sendInitialState;

const reactInterceptor = function(name, component) {
  return function(state, callback) {
    monocleStore.dispatch(updateState(name, state));
    return component.setState(state, callback);
  }
}

const grabInitialState = function(name, obj) {
  monocleStore.dispatch(sendInitialState(name, obj));
  return obj;
};

module.exports = {
  reactInterceptor,
  grabInitialState,
};

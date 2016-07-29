const monocleStore = require('../react/store/monocleStore');
const updateState = require('../react/actions/index').updateState;
const sendInitialState = require('../react/actions/index').sendInitialState;

export function reactInterceptor(name, component) {
  return (state, callback) => {
    monocleStore.dispatch(updateState(name, state));
    return component.setState(state, callback);
  };
}

export function grabInitialState(name, obj) {
  monocleStore.dispatch(sendInitialState(name, obj));
  return obj;
}

module.exports = {
  reactInterceptor,
  grabInitialState,
};

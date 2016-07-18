const updateState = (name, state) => ({
  type: 'UPDATE_STATE',
  name,
  state,
});

const sendInitialState = (name, obj) => ({
  type: 'INITIALIZE_STATE',
  name,
  obj,
});

module.exports = {
  updateState,
  sendInitialState,
};

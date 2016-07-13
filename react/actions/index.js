const updateState = (name, state) => ({
  type: 'UPDATE_STATE',
  name,
  state,
});

module.exports = updateState;
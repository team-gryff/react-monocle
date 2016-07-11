export const updateState = (name, state) => {
  return {
    type: 'UPDATE_STATE',
    name,
    state
  }
}
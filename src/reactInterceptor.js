module.exports = function(setStateFn) {
  return function(state, callback) {
    // dispatch state to state container to update d3 tree
    
    return setStateFn.call(setStateFn, state, callback);
  };
};
const createStore = require('redux').createStore;
const monocleApp = require('../reducers/monocleApp');

module.exports = (function() {
  if (!window.monocleStore)
    window.monocleStore = createStore(monocleApp);
  return window.monocleStore;
})();

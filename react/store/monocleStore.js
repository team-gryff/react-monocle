const createStore = require('redux').createStore;
const monocleApp = require('../reducers/monocleApp');

module.exports = createStore(monocleApp);

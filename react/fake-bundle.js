const monocleApp = require('./index');
const monocleStore = monocleApp.monocleStore;
const updateState = monocleApp.updateState;

// verify monocle store and update state
console.log('monocleStore', monocleStore);
console.log('updateState', updateState);

// test dispatch update state from fake bundle
monocleStore.dispatch('UPDATE_STATE', updateState('Main', { clicked: true }));
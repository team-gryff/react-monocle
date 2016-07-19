// initialize wrapper function so it's accessible on the window or global object during run-time
window.wrapper = require('../src/reactInterceptor.js').reactInterceptor;
window.grabInitialState = require('../src/reactInterceptor.js').grabInitialState;

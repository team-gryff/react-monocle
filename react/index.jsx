import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import monocleStore from './store/monocleStore';

function render () {
  ReactDOM.render(
    <App store={monocleStore.getState()} />,
    document.getElementById('content')
  );
}

// render first time;
render();

// run render function whenever monocleStore updates
monocleStore.subscribe(render);

// initialize wrapper function so it's accessible on the window or global object during run-time
const DEVELOPMENT = false;
if (DEVELOPMENT) {
  global.window = global;
}

window.wrapper = require('../src/reactInterceptor.js').reactInterceptor;
window.grabInitialState = require('../src/reactInterceptor.js').grabInitialState;

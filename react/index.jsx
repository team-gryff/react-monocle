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


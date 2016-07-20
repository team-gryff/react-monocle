import React from 'react';
import {render} from 'react-dom';
import TODO from './components/TODO.jsx';


class App extends React.Component {

  render () {
    return (
      <div>
        <h1>My Todo's</h1>
        <TODO />
      </div>
    )
  }
}

render(<App />, document.getElementById('app'));

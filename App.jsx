'use strict';
import React from 'react';


class App extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
      <h1>This is a hot reload example</h1>
      Hello World!
      {this.props.testprop}
      </div>
    )
  }
}


export default App;

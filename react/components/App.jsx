import React from 'react';
// import d3Obj from '../dummyTree';
// import d3Obj from '../gameTree';
import Graph from './Graph.jsx';

// if (!process.env.NODE_ENV) {
//   const d3Obj = require('../gameTree');
// }

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      treeData: {},
    };
  }

  componentWillMount() {
    // d3obj will be found from parse logic
    return this.setState({ treeData: d3Obj });
  }

  render() {
    return (
      <div>
        <Graph treeData={this.state.treeData} />
      </div>
    );
  }
}


export default App;

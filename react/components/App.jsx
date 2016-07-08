import React from 'react';
import d3Obj from '../dummyTree';
import Graph from './Graph.jsx';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      treeData: d3Obj,
    };
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

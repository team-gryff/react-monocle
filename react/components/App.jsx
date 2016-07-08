import React from 'react';
import dummyTree from '../dummyTree';
import Graph from './Graph.jsx';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      treeData: dummyTree,
    }
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

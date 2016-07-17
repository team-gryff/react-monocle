import React from 'react';
import Graph from './Graph.jsx';
const cloneDeep = require('lodash.clonedeep');
// const formatted = require('../../formattedDataNoState');




class App extends React.Component {
  constructor() {
    super();
    this.bfs = this.bfs.bind(this);
    this.treebuilder = this.treebuilder.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    // if (nextProps.state !== this.props.state) return this.setState({treeData: this.treebuilder(nextProps.state)});
    // else return;
  }

  treebuilder(state) {
    const result = cloneDeep(formatted[formatted.monocleENTRY]);
    const bfs = this.bfs;

    function treeRecurse(node, root, newState) {
      console.log(newState);
      if (!node.children) throw new Error('Invalid Node! Something went wrong with the parsing (no children array)');
      if (newState[node.name]) node.state = cloneDeep(newState[node.name]);
      
      if (node.children.length === 0) return; // base case
      const tempChildren = [];

      // iterating through children
      for (let j = 0; j < node.children.length; j++) {
        const child = cloneDeep(node.children[j]);

        // maybe check if it is object already
        if (formatted.hasOwnProperty(child.name)) child.children = cloneDeep(formatted[child.name].children); // adding children of child
        const source = bfs(root, child.props[0].parent);

        // if child is not made through an iterator
        if (!child.iterated) {
          const propsObj = {};

          // iterating through props to parse
          child.props.forEach(ele => {
            // if it has a prop or state find source and parse
            if (ele.value.match(/(^props.|^state.)/)) {
              propsObj[ele.name] = eval(`source.${ele.value}`);
            } else propsObj[ele.name] = ele.value; // else just return the value
          });
          child.props = propsObj;
          tempChildren.push(child);

          // if it is made through an iterator
        } else {
          switch (child.iterated) {
            case 'forIn':
              for (const key in eval(`source.${child.source}`)) {
                const forInChild = cloneDeep(child);

                const propsObj = {};
                forInChild.props.forEach(ele => {
                  if (ele.value.match(/(^props.|^state.)/)) {
                    propsObj[ele.name] = eval(`source.${ele.value}`);
                  } else if (ele.value.includes('key')) propsObj[ele.name] = ele.value.replace('key', key);
                  else propsObj[ele.name] = ele.value;
                });
                forInChild.props = propsObj;
                tempChildren.push(forInChild);
              }
              break;

            case 'forLoop':
              // do stuff
              for (let i = 0; i < eval(`source.${child.source}.length`); i++) {
                const forLoopChild = cloneDeep(child);

                // TEMP FOR NOW
                if (Array.isArray(node.state)) child.state = {};

                const propsObj = {};
                forLoopChild.props.forEach(ele => {
                  if (ele.value.match(/(^props.|^state.)/)) {
                    propsObj[ele.name] = eval(`source.${ele.value}`);
                  } else propsObj[ele.name] = ele.value;
                });
                forLoopChild.props = propsObj;
                tempChildren.push(forLoopChild);
              }
              break;

            case 'higherOrder':
              // do stuff
              for (let i = 0; i < eval(`source.${child.source}.length`); i++) {
                const forLoopChild = cloneDeep(child);
                const propsObj = {};

                forLoopChild.props.forEach(ele => {
                  if (ele.value.match(/(^props.|^state.)/)) {
                    propsObj[ele.name] = eval(`source.${ele.value}`);
                  } else propsObj[ele.name] = ele.value;
                });
                forLoopChild.props = propsObj;
                tempChildren.push(forLoopChild);
              }
              break;

            default:
              throw new Error('unrecognized iterator');
          }
        }
      }

      node.children = tempChildren;
      node.children.forEach(ele => {
        if (ele.children.length > 0) treeRecurse(ele, root, state);
      });
    }

    treeRecurse(result, result, state);
    return result;
  }

  bfs(tree, nodeName) {
    let queue = [tree];

    while (queue.length > 0) {
      if (queue[0].name === nodeName) return queue[0];
      if (queue[0].children.length > 0) queue = queue.concat(queue[0].children);
      queue.shift();
    }
    return false;
  }

  render() {
    const builtObj = this.treebuilder(this.props.store);
    return (
      <div>
        <Graph treeData={builtObj} />
      </div>
    );
  }
}

App.propTypes = {
  state: React.PropTypes.object.isRequired,
};

App.defaultProps = {
  state: {
    App: {
      dice: {
        0: 'a',
        1: 'b',
        2: 'c',
        3: 'd',
        4: 'e',
        5: 'f',
      },
      selected: {},
      selectionHistory: [2],
      current: 'WORKPLS',
      currBlock: 3,
      wordsPlayed: {
        testing: 9,
        this: 10,
        haha: 11,
      },
      score: 20,
    },
  },
};


export default App;

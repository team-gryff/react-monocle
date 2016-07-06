'use strict';
const reactParser = require('./reactParser');
const cloneDeep = require('lodash.clonedeep');


/**
 * Takes in a formatted object and returns the tree object that D3 will need
 * @param {obj} Object
 * @return {Object} Tree object for D3
 */
function d3DataBuilder(obj) {
  if (!obj.ENTRY) throw new Error('Entry component not found');
  const ENTRY = obj.ENTRY;
  const formatted = {};

// parsing AST into formatted objects based on ES5/ES6 syntax
  for (const key in obj) {
    if (key === 'ENTRY') continue;
    // componentChecker returns true for es6 classes, false for everything else
    if (reactParser.componentChecker(obj[key])) formatted[key] = reactParser.getES6ReactComponents(obj[key]);
    else {
      const es5obj = reactParser.getES5ReactComponents(obj[key]);
      formatted[key] = es5obj; // if the name is defined, it is an es5 component
      formatted[key].name = key;
      // else formatted[key] = reactParser.getStatelessFunctionalComponents(obj[key]); //else it is a stateless functional component
    }
  }

  const result = cloneDeep(formatted[ENTRY]);

// recursive function to concat and build the d3 object
  function treeAddition(node) {
    if (!node.children) throw new Error('Invalid Node! Something went wrong with the parsing (no children array)');
    if (node.children.length === 0) return; // base case
    for (let i = 0; i < node.children.length; i++) {
      if (formatted.hasOwnProperty(node.children[i].name)) {
        node.children[i].children = cloneDeep(formatted[node.children[i].name].children);
        node.children[i].state = cloneDeep(formatted[node.children[i].name].state);
      } else throw new Error('Parse Error: Could not find needed component');
      if (node.children[i].children.length > 0) treeAddition(node.children[i]); // if the component has nested components, recurse through
    }
  }
  treeAddition(result);
  return result;
}


module.exports = d3DataBuilder;

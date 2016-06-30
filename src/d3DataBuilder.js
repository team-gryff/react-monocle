'use strict';
const reactParser = require('./reactParser');
const cloneDeep = require('lodash.clonedeep');



function d3DataBuilder(obj) {
  const ENTRY = obj.ENTRY;
  const formated = {};

  for (let key in obj) {
    if (key === 'ENTRY') continue;
    if (reactParser.componentChecker(obj[key])) {
      formated[key] = reactParser.getES6ReactComponents(obj[key]);
    } else {
      formated[key] = reactParser.getES5ReactComponents(obj[key]);
    }
  }

  let result = cloneDeep(formated[ENTRY]);

// recursive function to concat and build the d3 object
  function treeAddition(node) {
    if (node.children.length === 0) return;
    for (let i = 0; i < node.children.length; i++) {
      if (formated.hasOwnProperty(node.children[i].name)) node.children[i].children = formated[node.children[i].name].children;
      if (node.children[i].children.length > 0) treeAddition(node.children[i]);
    }
  }
  treeAddition(result);
  console.log(result);
  return result;
}



module.exports = d3DataBuilder

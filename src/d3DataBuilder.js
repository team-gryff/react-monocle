'use strict';
const reactParser = require('./reactParser');
const fs = require('fs');

/**
 * Takes in a formatted object and returns the tree object that D3 will need
 * @param {obj} Object
 * @return {Object} Tree object for D3
 */
function d3DataBuilder(obj) {
  if (!obj.ENTRY) throw new Error('Entry component not found');
  const formatted = {};

  // parsing AST into formatted objects based on ES5/ES6 syntax
  Object.entries(obj).forEach(entry => {
    if (entry[0] === 'ENTRY') return;
    const componentChecker = reactParser.componentChecker(entry[1]);
    switch (componentChecker) {
      case 'ES6':
        formatted[entry[0]] = reactParser.getES6ReactComponents(entry[1]);
        break;
      case 'ES5':
        formatted[entry[0]] = reactParser.getES5ReactComponents(entry[1]);
        break;
      default:
        formatted[entry[0]] = reactParser.getStatelessFunctionalComponents(entry[1], entry[0]);
        break;
    }
  });

  Object.values(formatted).forEach(node => {
    node.children.forEach(ele => {
      if (Array.isArray(ele.props)) {
        ele.props.forEach((propped, i) => {
          if (typeof propped.value === 'object' && propped.value.name && propped.value.children) {
            formatted[propped.parent].children.push(propped.value);
            ele.props.splice(i, 1);
          }
        });
      }
    });
  });

  formatted.monocleENTRY = obj.ENTRY;
  fs.writeFileSync('data.js', JSON.stringify(formatted, null, 2));

  return formatted;
}


module.exports = d3DataBuilder;

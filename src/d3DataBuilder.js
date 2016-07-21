'use strict';
const reactParser = require('./reactParser');

/**
 * Takes in a formatted object and returns the tree object that D3 will need
 * @param {obj} Object
 * @return {Object} Tree object for D3
 */
function d3DataBuilder(obj) {
  if (!obj.ENTRY) throw new Error('Entry component not found');
  const formatted = {};

// parsing AST into formatted objects based on ES5/ES6 syntax
  for (const key in obj) {
    if (key === 'ENTRY') continue;
    // componentChecker returns true for es6 classes, false for everything else
    else if (reactParser.componentChecker(obj[key])) formatted[key] = reactParser.getES6ReactComponents(obj[key]);
    else {
      const es5obj = reactParser.getES5ReactComponents(obj[key]);
      formatted[key] = es5obj; // if the name is defined, it is an es5 component
      formatted[key].name = key;
      // else formatted[key] = reactParser.getStatelessFunctionalComponents(obj[key]); //else it is a stateless functional component
    }
  }

  for (const key in formatted) {
    formatted[key].children.forEach(ele => {
      if (Array.isArray(ele.props)) {
        ele.props.forEach((propped, i) => {
          if (typeof propped.value === 'object' && propped.value.name && propped.value.children) {
            formatted[propped.parent].children.push(propped.value);
            ele.props.splice(i, 1);
          }
        });
      }
    });
  };
  formatted.monocleENTRY = obj.ENTRY;

  return formatted;
}


module.exports = d3DataBuilder;

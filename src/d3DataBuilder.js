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
  for (const key in obj) {
    if (key === 'ENTRY') continue;
    const componentChecker = reactParser.componentChecker(obj[key]);
    // componentChecker returns true for es6 classes, false for everything else
    if (componentChecker === 'ES6') formatted[key] = reactParser.getES6ReactComponents(obj[key]);
    else if (componentChecker === 'ES5') formatted[key] = reactParser.getES5ReactComponents(obj[key]);
    else formatted[key] = reactParser.getStatelessFunctionalComponents(obj[key], key)
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
  fs.writeFileSync('data.js', JSON.stringify(formatted, null, 2))

  return formatted;
}


module.exports = d3DataBuilder;

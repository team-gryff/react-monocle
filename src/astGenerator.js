'use strict';
const fs = require('fs');
const acorn = require('acorn-jsx/inject')(require('acorn'));

/**
 * Takes in directory name and generates an AST based on the File.
 * If it is a React Component an object is returned with the corresponding key/value pair
 * ComponentName: AST
 * @param {directory} file directory
 * @returns {Object} Object with Component name and AST
 */

function astGenerator(directory, entry) {
  // TODO: support for stateless functional components
  // using directory of component to turn into string for acorn
  const stringed = fs.readFileSync(directory, { encoding: 'utf-8' });
  const result = {};
  let name;

  // ast generation
  const ast = acorn.parse(stringed, {
    sourceType: 'module',
    plugins: { jsx: true },
  });

//  starting backwards because export statements are likely to be at the end of a file
  for (let i = ast.body.length - 1; i >= 0; i--) {
      // finding ES6 export default
    if (ast.body[i].type === 'ExportDefaultDeclaration') {
      name = ast.body[i].declaration.name || ast.body[i].declaration.id.name;
      result[name] = ast;
      if (entry) return { ENTRY: name };
      return result;
    } else if (ast.body[i].type === 'ExpressionStatement') {
      // finding CJS module.exports
      if (ast.body[i].expression.left && ast.body[i].expression.left.object.name === 'module') {
        name = ast.body[i].expression.right.name;
        result[name] = ast;
        if (entry) return { ENTRY: name };
        return result;
        // finding entry point
      } else if (ast.body[i].expression.callee && ast.body[i].expression.callee.object.name === 'ReactDOM' && ast.body[i].expression.callee.property.name === 'render') {
        result.ENTRY = ast.body[i].expression.arguments[0].openingElement.name.name;
        return result;
      }
    }
  }
  // TODO: find better return if no results;
  return;
}


module.exports = astGenerator;

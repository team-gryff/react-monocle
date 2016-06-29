'use strict'
const fs = require('fs')
const acorn = require('acorn-jsx/inject')(require('acorn'));



function astGenerator(directory) {
  // using directory of component to turn into string for acorn
  const stringed = fs.readFileSync(directory, {encoding:'utf-8'});
  let result = {}, name;

  // ast generation
  let ast = acorn.parse(stringed, {
    sourceType: 'module',
    plugins: {jsx:true}
  });

//  starting backwards because export statements are likely to be at the end of a file
  for (let i = ast.body.length - 1; i >= 0; i--) {
    if (ast.body[i].type === 'ExportDefaultDeclaration') {
      //finding ES6 export default
      name = ast.body[i].declaration.name || ast.body[i].declaration.id.name;
      result[name] = ast;
      return result;
    } else if (ast.body[i].type === 'ExpressionStatement') {
      //finding CJS module.exports
      if (ast.body[i].expression.left && ast.body[i].expression.left.object.name === 'module') {
        name = ast.body[i].expression.right.name;
        result[name] = ast;
        return result;
        // finding entry point
      } else if (ast.body[i].expression.callee && ast.body[i].expression.callee.object.name === 'ReactDOM' && ast.body[i].expression.callee.property.name === 'render') {
        result.ENTRY = ast;
        return result;
      }
    }
  }
  // TODO: find better return if no results;
  return;
}


module.exports = astGenerator
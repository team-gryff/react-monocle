'use strict'
const fs = require('fs')
const acorn = require('acorn-jsx/inject')(require('acorn'));



function astGenerator(directory) {
  console.log(directory);
  // using directory of component to turn into string for acorn
  const stringed = fs.readFileSync(directory, {encoding:'utf-8'});
  let result = {}, name;

  // ast generation
  let ast = acorn.parse(stringed, {
    sourceType: 'module',
    plugins: {jsx:true}
  });

  for (let i = ast.body.length - 1; i >= 0; i--) {
    if (ast.body[i].type === 'ExportDefaultDeclaration') {
      //finding ES6 export default
      name = ast.body[i].declaration.name || ast.body[i].declaration.id.name;
      result[name] = ast;
      return result;
    } else if (ast.body[i].type === 'ExpressionStatement' && ast.body[i].expression.left.object.name === 'module') {
      //finding CJS module.exports
      name = ast.body[i].expression.right.name;
      result[name] = ast;
      return result;
    }
  }
  return;
}


module.exports = astGenerator
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
  let splicing;
  let found;

  // ast generation
  const ast = acorn.parse(stringed, {
    sourceType: 'module',
    plugins: { jsx: true },
  });

  function nameFinder(node) {
    if ((node.superClass.type === 'MemberExpression' && node.superClass.object.name === 'React' && node.superClass.property.name === 'Component')
     || (node.superClass.type === 'Identifier' && node.superClass.name === 'Component')) return node.id.name;
  }

//  starting backwards because export statements are likely to be at the end of a file
  // for (let i = ast.body.length - 1; i >= 0; i--) {
  //     // finding ES6 export default
  //   if (ast.body[i].type === 'ExportDefaultDeclaration') {
  //     name = ast.body[i].declaration.name || ast.body[i].declaration.id.name;
  //     if (entry) result.ENTRY = name;
  //     else result[name] = ast;
  //   } else if (ast.body[i].type === 'ExpressionStatement') {
  //     // finding CJS module.exports
  //     if (ast.body[i].expression.left && ast.body[i].expression.left.object.name === 'module') {
  //       name = ast.body[i].expression.right.name;
  //       if (entry) result.ENTRY = name;
  //       else result[name] = ast;
  //       // finding entry point
  //     } else if (ast.body[i].expression.callee && ast.body[i].expression.callee.object.name === 'ReactDOM' && ast.body[i].expression.callee.property.name === 'render') {
  //       console.log('splicing');
  //       splicing = i;
  //       name = ast.body[i].expression.arguments[0].openingElement.name.name;
  //       result.ENTRY = name;
  //       result[name] = ast;
  //     }
  //   }
  // }
  ast.body.forEach((node, i) => {
    if (node.type === 'ClassDeclaration' && node.superClass) {
      name = nameFinder(node);
      found = true;
    } else if (node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ClassDeclaration'
      && node.declaration.superClass) {
      name = nameFinder(node.declaration);
      found = true;
    } else if (node.type === 'VariableDeclaration' && node.declarations[0].init && node.declarations[0].init.callee
      && node.declarations[0].init.callee.object && node.declarations[0].init.callee.object.name === 'React'
      && node.declarations[0].init.callee.property.name === 'createClass') {
      name = node.declarations[0].id.name;
      found = true;
    } else if (node.type === 'ExpressionStatement' && node.expression.callee) {
      if ((node.expression.callee.type === 'MemberExpression' && node.expression.callee.object.name === 'ReactDOM'
        && node.expression.callee.property.name === 'render') || (node.expression.callee.type === 'Identifier' && node.expression.callee.name === 'render')) {
        name = node.expression.arguments[0].openingElement.name.name;
        result.ENTRY = name;
        splicing = i;
      }
    }
  });

  if (splicing) ast.body.splice(splicing, 1);
  if (found) result[name] = ast;
  return result;
}


module.exports = astGenerator;

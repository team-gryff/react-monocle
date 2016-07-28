'use strict';
const fs = require('fs');
const acorn = require('acorn-jsx/inject')(require('acorn'));
const esquery = require('../esquery/esquery');

/**
 * Takes in directory name and generates an AST based on the File.
 * If it is a React Component an object is returned with the corresponding key/value pair
 * ComponentName: AST
 * @param {directory} file directory
 * @returns {Object} Object with Component name and AST
 */

function astGenerator(directory) {
  // using directory of component to turn into string for acorn
  const stringed = fs.readFileSync(directory, { encoding: 'utf-8' });
  const result = {};
  let name;
  let splicing;
  let found;
  let sfc;
  const sfcNames = [];

  // ast generation
  const ast = acorn.parse(stringed, {
    sourceType: 'module',
    plugins: { jsx: true },
  });

  function nameFinder(node) {
    if ((node.superClass.type === 'MemberExpression' &&
      node.superClass.object.name === 'React' &&
      node.superClass.property.name === 'Component')
      || (node.superClass.type === 'Identifier' &&
      node.superClass.name === 'Component')) return node.id.name;
    throw new Error(`Unable to find component name at specified directory: ${directory}`);
  }

  ast.body.forEach((node, i) => {
    if (node.type === 'ClassDeclaration' && node.superClass) {
      name = nameFinder(node);
      found = true;
    } else if (node.type === 'ExportDefaultDeclaration') {
      if (node.declaration.type === 'ClassDeclaration' &&
        node.declaration.superClass) {
        name = nameFinder(node.declaration);
        found = true;
      } else if (node.declaration.name || node.declaration.id.name) {
        sfc = node.declaration.name || node.declaration.id.name;
      }
    } else if (node.type === 'VariableDeclaration' && node.declarations[0].init) {
      if (node.declarations[0].init.callee &&
        node.declarations[0].init.callee.object &&
        node.declarations[0].init.callee.object.name === 'React' &&
        node.declarations[0].init.callee.property.name === 'createClass') {
        name = node.declarations[0].id.name;
        found = true;
      } else if (node.declarations[0].init.type === 'FunctionExpression' ||
        node.declarations[0].init.type === 'ArrowFunctionExpression') {
        if (esquery(node, 'JSXElement').length < 0) {
          sfcNames.push(node.declarations[0].id.name);
        }
      }
    } else if (node.type === 'ExpressionStatement') {
      if (node.expression.callee) {
        if ((node.expression.callee.type === 'MemberExpression' &&
        node.expression.callee.object.name === 'ReactDOM' &&
        node.expression.callee.property.name === 'render') ||
        (node.expression.callee.type === 'Identifier' &&
        node.expression.callee.name === 'render')) {
          name = node.expression.arguments[0].openingElement.name.name;
          result.ENTRY = name;
          splicing = i;
        }
      } else if (node.expression.left && node.expression.left.object.name === 'module') {
        sfc = node.expression.right.name;
      }
    } else if (node.type === 'FunctionDeclaration') {
      if (esquery(node, 'JSXElement').length > 0) {
        sfcNames.push(node.id.name);
      }
    }
  });


  if (splicing) ast.body.splice(splicing, 1);
  if (found) result[name] = ast;
  if (sfc && sfcNames.indexOf(sfc) !== -1) result[sfc] = ast;
  return result;
}


module.exports = astGenerator;

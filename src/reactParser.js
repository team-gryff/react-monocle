const acorn = require('acorn-jsx');  
const esrecurse = require('esrecurse');  
const t = require('ast-types').builders;  

function jsToD3Ast(js) {
  const jsAst = acorn.parse(js);
  if (jsAst.body.length === 0) throw new Error('Empty AST input');
  
  const output = [];
  esrecurse.visit(jsAst, {
    VariableDeclarator(node) {
      output.push(node.id.name);
    },
  });
  return output;
}

module.exports = jsToD3Ast;
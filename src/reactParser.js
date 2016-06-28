'use strict';

const acorn = require('acorn-jsx');  
const esrecurse = require('esrecurse');  

let jsAst;

function getES5ReactComponents() {
  let output = [];
  let currVariableName;
  esrecurse.visit(jsAst, {
    VariableDeclarator: function (node) {
      currVariableName = node.id.name;
      this.visitChildren(node);
    },
    MemberExpression: function (node) {
      if (currVariableName) {
        if (node.property && node.property.name === "createClass") {
          output.push({
            name: currVariableName
          });
          currVariableName = undefined;
        }
      }
    }
  });
  return output;
}

function isReactComponent (node) {
  return (node.superClass.property && node.superClass.property.name === "Component")
    || node.superClass.name === "Component"
}

function getES6ReactComponents() {
  let output = [];
  esrecurse.visit(jsAst, {
    ClassDeclaration: function (node) {
      if (isReactComponent(node)) {
        output.push({
          name: node.id.name,
        });
      }
    }
  });
  return output;
}

function jsToAst(js) {
  jsAst = acorn.parse(js);
  if (jsAst.body.length === 0) throw new Error('Empty AST input');
}

module.exports = { 
  jsToAst, 
  getES5ReactComponents, 
  getES6ReactComponents 
};
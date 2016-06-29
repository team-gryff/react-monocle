'use strict';

const acorn = require('acorn-jsx');  
const esrecurse = require('esrecurse');  


const htmlElements = ['a', 'article', 'audio', 'b', 'body', 'br', 'button', 'canvas', 'caption',
                      'code', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'font', 'footer', 'form',
                      'frame', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'html', 'i', 'iframe', 'img',
                      'input', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'noscript',
                      'object', 'ol', 'option', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rt',
                      'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span',
                      'strong', 'style', 'sub', 'summary', 'table', 'tbody', 'td', 'thead', 'title',
                      'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];

let jsAst;

function getES5ReactComponents() {
  let output = {};
  let currVariableName;
  esrecurse.visit(jsAst, {
    VariableDeclarator: function (node) {
      currVariableName = node.id.name;
      this.visitChildren(node);
    },
    MemberExpression: function (node) {
      if (currVariableName) {
        if (node.property && node.property.name === "createClass") {
          output.name = currVariableName
        }
      }
    },
    Property: function (node) {
      if (node.key.name === "render") {
        this.visitChildren(node);
      }
    },
    ReturnStatement: function (node) {
      if (node.argument.type === 'JSXElement') {
        this.visitChildren(node);
      }
    },
    JSXElement: function (node) {
      var jsxComponentsArr = node
        .children
        .filter(jsx => {
          return jsx.type === "JSXElement" &&
            htmlElements.indexOf(jsx.openingElement.name.name) < 0
        });
      for (let prop in output) {
        if (output[prop] === currVariableName) {
          output.children = jsxComponentsArr.map(jsx => {
            return { name: jsx.openingElement.name.name };
          });
        }
      }
    },
  });
  return output;
}

function isReactComponent (node) {
  return (node.superClass.property && node.superClass.property.name === "Component")
    || node.superClass.name === "Component"
}

function getES6ReactComponents() {
  let output = {};
  esrecurse.visit(jsAst, {
    ClassDeclaration: function (node) {
      if (isReactComponent(node)) {
        output.name = node.id.name
      }
    }
  });
  return output;
}

function jsToAst(js) {
  jsAst = acorn.parse(js, { 
    plugins: { jsx: true }
  });
  if (jsAst.body.length === 0) throw new Error('Empty AST input');
}

module.exports = { 
  jsToAst, 
  getES5ReactComponents, 
  getES6ReactComponents 
};
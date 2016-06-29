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
  let output = {}, topJsxComponent;
  esrecurse.visit(jsAst, {
    VariableDeclarator: function (node) {
      topJsxComponent = node.id.name;
      this.visitChildren(node);
    },
    MemberExpression: function (node) {
      if (node.property && node.property.name === "createClass") {
        output.name = topJsxComponent;
      }
    },
    JSXElement: function (node) {
      output.children = getChildJSXElements(node);
    },
  });
  return output;
}

function getChildProps (node) {
  if (node.openingElement.attributes.length === 0) return [];
  return node.openingElement.attributes
    .map(attribute => { return { name: attribute.name.name }; });
}

function getChildJSXElements (node) {
  if (node.children.length === 0) return [];
  var childJsxComponentsArr = node
    .children
    .filter(jsx => jsx.type === "JSXElement" 
    && htmlElements.indexOf(jsx.openingElement.name.name) < 0);
  return childJsxComponentsArr
    .map(child => {
      return {
        name: child.openingElement.name.name,
        children: getChildJSXElements(child),
        props: getChildProps(child),
      };
    })
}

function isES6ReactComponent (node) {
  return (node.superClass.property && node.superClass.property.name === "Component")
    || node.superClass.name === "Component"
}

function getES6ReactComponents() {
  let output = {};
  esrecurse.visit(jsAst, {
    ClassDeclaration: function (node) {
      if (isES6ReactComponent(node)) {
        output.name = node.id.name;
        this.visitChildren(node);
      }
    },
    JSXElement: function (node) {
      output.children = getChildJSXElements(node);
    },
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
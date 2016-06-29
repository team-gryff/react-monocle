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

let ast;

/**
 * Recursively walks AST and extracts ES5 React component names, child components, props and state
 * @returns {Object} Nested object containing name, children, props and state properties of components
 */
function getES5ReactComponents(ast) {
  let output = {}, topJsxComponent;
  esrecurse.visit(ast, {
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
      output.props = getReactProps(node);
    },
  });
  return output;
}

/**
 * Returns array of props from React component passed to input
 * @param {Node} node
 * @returns {Array} Array of all JSX props on React component
 */
function getReactProps (node) {
  if (node.openingElement.attributes.length === 0) return [];
  return node.openingElement.attributes
    .map(attribute => { return { name: attribute.name.name }; });
}

/**
 * Returns array of children components of React component passed to input
 * @param {Node} node
 * @returns {Array} Array of (nested) children of React component passed in
 */
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
        props: getReactProps(child),
      };
    })
}

/**
 * Returns if AST node is an ES6 React component
 * @param {Node} node
 * @return {Boolean} Determines if AST node is a React component node 
 */
function isES6ReactComponent (node) {
  return (node.superClass.property && node.superClass.property.name === "Component")
    || node.superClass.name === "Component"
}

/**
 * Recursively walks AST and extracts ES6 React component names, child components, props and state
 * @returns {Object} Nested object containing name, children, props and state properties of components
 */
function getES6ReactComponents(ast) {
  let output = {};
  esrecurse.visit(ast, {
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

/**
 * Helper function to convert Javascript stringified code to an AST using acorn-jsx library
 * @param js
 */
function jsToAst(js) {
  ast = acorn.parse(js, { 
    plugins: { jsx: true }
  });
  if (ast.body.length === 0) throw new Error('Empty AST input');
}

module.exports = { 
  jsToAst, 
  getES5ReactComponents, 
  getES6ReactComponents 
};
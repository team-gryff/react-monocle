'use strict';

const acorn = require('acorn-jsx');  
const esrecurse = require('esrecurse');  
const escodegen = require('escodegen');

const htmlElements = require('./constants.js').htmlElements;
const reactMethods = require('./constants.js').reactMethods;

/**
 * Recursively walks AST and extracts ES5 React component names, child components, props and state
 * @param {ast} ast
 * @returns {Object} Nested object containing name, children, props and state properties of components
 */
function getES5ReactComponents(ast) {
  let output = {
    name: '',
    state: [],
    props: [],
    children: [],
  }, 
  topJsxComponent;
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
    ObjectExpression: function (node) {
      const getInitialStateProp = node.properties.filter(prop => prop.key.name === "getInitialState")[0];
      if (getInitialStateProp) {
        output.state = getReactStates(getInitialStateProp.value.body.body[0].argument);
      }
      this.visitChildren(node);
    },
    JSXElement: function (node) {
      output.children = getChildJSXElements(node);
      output.props = getReactProps(node);
    },
  });
  return output;
}

function getReactMethods (node) {

}

function getReactStates (node) {
  const stateStr = escodegen.generate(node);
  let states;
  eval('states = ' + stateStr);

  let output = [];
  for (let state in states) {
    output.push({
      name: state,
      value: states[state]
    });
  }
  
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
        state: [],
        methods: [],
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
 * @param {ast} ast
 * @returns {Object} Nested object containing name, children, props and state properties of components
 */
function getES6ReactComponents(ast) {
  let output = {
    name: '',
    props: [],
    state: [],
    methods: [],
    children: [],
  };
  esrecurse.visit(ast, {
    ClassDeclaration: function (node) {
      if (isES6ReactComponent(node)) {
        output.name = node.id.name;
        this.visitChildren(node);
      }
    },
    MethodDefinition: function (node) {
      if (reactMethods.indexOf(node.key.name) < 0)
        output.methods.push(node.key.name);
      this.visitChildren(node);
    },
    ExpressionStatement: function (node) {
      if  (node.expression.left && node.expression.left.property && node.expression.left.property.name === 'state') {
        output.state = getReactStates(node.expression.right)
      }
    },
    JSXElement: function (node) {
      output.children = getChildJSXElements(node);
      output.props = getReactProps(node);
    },
  });

  return output;
}

function getStatelessFunctionalComponents(ast) {

  return;
}

/**
 * Helper function to convert Javascript stringified code to an AST using acorn-jsx library
 * @param js
 */
function jsToAst(js) {
  const ast = acorn.parse(js, { 
    plugins: { jsx: true }
  });
  if (ast.body.length === 0) throw new Error('Empty AST input');
  return ast;
}

function componentChecker(ast) {
  for (let i = 0; i < ast.body.length; i++) {
    if (ast.body[i].type === 'ClassDeclaration' || ast.body[i].type === 'ExportDefaultDeclaration') return true;
  }
  return false;
}

module.exports = { 
  jsToAst, 
  componentChecker,
  getES5ReactComponents, 
  getES6ReactComponents,
  getStatelessFunctionalComponents
};
'use strict';

const acorn = require('acorn-jsx');
const esrecurse = require('esrecurse');
const escodegen = require('escodegen');

const htmlElements = require('./constants.js').htmlElements;
const reactMethods = require('./constants.js').reactMethods;

function getReactStates(node) {
  const stateStr = escodegen.generate(node);
  let states;
  eval(`states = ${stateStr}`);

  const output = [];
  for (const state in states) {
    output.push({
      name: state,
      value: states[state],
    });
  }

  return output;
}

/**
 * Returns array of props from React component passed to input
 * @param {Node} node
 * @returns {Array} Array of all JSX props on React component
 */
function getReactProps(node, parent) {
  if (node.openingElement.attributes.length === 0) return [];
  return node.openingElement.attributes
    .map(attribute => {
      let valueType;
      const valueName = attribute.value.expression.property.name;
      if (attribute.value.expression.object.property) {
        valueType = attribute.value.expression.object.property.name;
      }
      return {
        name: attribute.name.name,
        value: valueType ? `${valueType}.${valueName}` : valueName,
        parent: parent,
      };
    });
}

/**
 * Returns array of children components of React component passed to input
 * @param {Node} node
 * @returns {Array} Array of (nested) children of React component passed in
 */
function getChildJSXElements(node, parent) {
  if (node.children.length === 0) return [];
  const childJsxComponentsArr = node
    .children
    .filter(jsx => jsx.type === 'JSXElement'
    && htmlElements.indexOf(jsx.openingElement.name.name) < 0);
  return childJsxComponentsArr
    .map(child => {
      return {
        name: child.openingElement.name.name,
        children: getChildJSXElements(child, parent),
        props: getReactProps(child, parent),
        state: [],
        methods: [],
      };
    });
}

/**
 * Returns if AST node is an ES6 React component
 * @param {Node} node
 * @return {Boolean} Determines if AST node is a React component node
 */
function isES6ReactComponent(node) {
  return (node.superClass.property && node.superClass.property.name === 'Component')
    || node.superClass.name === 'Component';
}

/**
 * Recursively walks AST and extracts ES5 React component names, child components, props and state
 * @param {ast} ast
 * @returns {Object} Nested object containing name, children, props and state properties of components
 */
function getES5ReactComponents(ast) {
  const output = {
    name: '',
    state: [],
    props: [],
    methods: [],
    children: [],
  };
  let topJsxComponent;
  let outside;
  esrecurse.visit(ast, {
    VariableDeclarator(node) {
      topJsxComponent = node.id.name;
      this.visitChildren(node);
    },
    MemberExpression(node) {
      if (node.property && node.property.name === 'createClass') {
        output.name = topJsxComponent;
      }
      this.visitChildren(node);
    },
    ObjectExpression(node) {
      node.properties.forEach(prop => {
        switch (prop.key.name) {
          case 'getInitialState':
            output.state = getReactStates(prop.value.body.body[0].argument);
            break;
          default:
            if (reactMethods.indexOf(prop.key.name) < 0
                && prop.value.type === 'FunctionExpression') {
              output.methods.push(prop.key.name);
            }
            break;
        }
      });
      this.visitChildren(node);
    },
    JSXElement(node) {
      output.children = getChildJSXElements(node, output.name);
      output.props = getReactProps(node, output.name);
      if (htmlElements.indexOf(node.openingElement.name.name) < 0) {
        outside = {
          name: node.openingElement.name.name,
          children: getChildJSXElements(node, output.name),
          props: getReactProps(node, output.name),
          state: [],
          methods: [],
        };
      }
    },
  });

  if (outside) output.children.push(outside);
  return output;
}

/**
 * Recursively walks AST and extracts ES6 React component names, child components, props and state
 * @param {ast} ast
 * @returns {Object} Nested object containing name, children, props and state properties of components
 */
function getES6ReactComponents(ast) {
  const output = {
    name: '',
    props: [],
    state: [],
    methods: [],
    children: [],
  };
  let outside;
  esrecurse.visit(ast, {
    ClassDeclaration(node) {
      if (isES6ReactComponent(node)) {
        output.name = node.id.name;
        this.visitChildren(node);
      }
    },
    MethodDefinition(node) {
      if (reactMethods.indexOf(node.key.name) < 0) output.methods.push(node.key.name);
      this.visitChildren(node);
    },
    ExpressionStatement(node) {
      if (node.expression.left && node.expression.left.property && node.expression.left.property.name === 'state') {
        output.state = getReactStates(node.expression.right);
      }
      this.visitChildren(node);
    },
    JSXElement(node) {
      output.children = getChildJSXElements(node, output.name);
      output.props = getReactProps(node, output.name);
      if (htmlElements.indexOf(node.openingElement.name.name) < 0) {
        outside = {
          name: node.openingElement.name.name,
          children: getChildJSXElements(node, output.name),
          props: getReactProps(node, output.name),
          state: [],
          methods: [],
        };
      }
    },
  });

  if (outside) output.children.push(outside);
  return output;
}

/**
 * Recursively walks AST extracts name, child component, and props for a stateless functional component
 * Still a WIP - no way to tell if it is actually a component or just a function
 * @param {ast} ast
 * @returns {Object} Nested object containing name, children, and props properties of components
 */
function getStatelessFunctionalComponents(ast) {
  const output = {
    name: '',
    props: [],
    state: [],
    methods: [],
    children: [],
  };
  esrecurse.visit(ast, {
    VariableDeclarator(node) {
      if (output.name === '') output.name = node.id.name;
      this.visitChildren(node);
    },

    JSXElement(node) {
      output.children = getChildJSXElements(node);
      output.props = getReactProps(node, output.name);
    },
  });
  return output;
}

/**
 * Helper function to convert Javascript stringified code to an AST using acorn-jsx library
 * @param js
 */
function jsToAst(js) {
  const ast = acorn.parse(js, {
    plugins: { jsx: true },
  });
  if (ast.body.length === 0) throw new Error('Empty AST input');
  return ast;
}

function componentChecker(ast) {
  for (let i = 0; i < ast.body.length; i++) {
    if (ast.body[i].type === 'ClassDeclaration') return true;
    if (ast.body[i].type === 'ExportDefaultDeclaration' && ast.body[i].declaration.type === 'ClassDeclaration') return true;
  }
  return false;
}

module.exports = {
  jsToAst,
  componentChecker,
  getES5ReactComponents,
  getES6ReactComponents,
  getStatelessFunctionalComponents,
};

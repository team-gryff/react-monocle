'use strict';

const acorn = require('acorn-jsx');
const esrecurse = require('../esrecurse/esrecurse');
const escodegen = require('escodegen');
const esquery = require('../esquery/esquery');
const bfs = require('acorn-bfs');

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
  if (node.openingElement.attributes.length === 0 ||
  htmlElements.indexOf(node.openingElement.name.name) > 0) return {};
  const result = node.openingElement.attributes
    .map(attribute => {
      const name = attribute.name.name;
      let valueName;
      if (attribute.value === null) valueName = undefined;
      else if (attribute.value.type === 'Literal') valueName = attribute.value.value;
      else if (attribute.value.expression.type === 'Literal') {
        valueName = attribute.value.expression.value;
      } else if (attribute.value.expression.type === 'Identifier') {
        valueName = attribute.value.expression.name;
      } else if (attribute.value.expression.type === 'CallExpression') {
        valueName = attribute.value.expression.callee.object.property.name;
      } else if (attribute.value.expression.type === 'BinaryExpression') {
        valueName = attribute.value.expression.left.name
          + attribute.value.expression.operator
          + (attribute.value.expression.right.name
          || attribute.value.expression.right.value);
      } else if (attribute.value.expression.type === 'MemberExpression') {
        let current = attribute.value.expression;
        while (current && current.property) {
          //  && !current.property.name.match(/(state|props)/)
          valueName = `.${current.property.name}${valueName || ''}`;
          current = current.object;
          if (current.type === 'Identifier') {
            valueName = `.${current.name}${valueName || ''}`;
            break;
          }
        }
        valueName = valueName.replace('.', '');
      } else if (attribute.value.expression.type === 'LogicalExpression') {
        valueName = attribute.value.expression.left.property.name;
        // valueType = attribute.value.expression.left.object.name;
      } else if (attribute.value.expression.type === 'JSXElement') {
        const nodez = attribute.value.expression;
        const output = {
          name: nodez.openingElement.name.name,
          children: getChildJSXElements(nodez, parent),
          props: getReactProps(nodez, parent),
          state: {},
          methods: [],
        };
        valueName = output;
      } else valueName = escodegen.generate(attribute.value);

      return {
        name,
        value: valueName,
        parent,
      };
    });
  return result;
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
        state: {},
        methods: [],
      };
    });
}

function forInFinder(arr, name) {
  const result = arr.map(ele => {
    const jsxnode = esquery(ele, 'JSXElement')[0];
    const obj = {};
    obj.variables = {};
    esquery(ele, 'VariableDeclarator').forEach(vars => {
      if (vars.id.name !== 'i' && vars.init) {
        obj.variables[vars.id.name] = escodegen.generate(vars.init).replace('this.', '');
      }
    });
    if (ele.left.declarations) obj.variables[ele.left.declarations[0].id.name] = '[key]';
    else if (ele.left.type === 'Identifier') obj.variables[ele.left.name] = '[key]';

    if (jsxnode && htmlElements.indexOf(jsxnode.openingElement.name.name)) {
      let current = ele.right;
      let found;
      while (current && current.property) {
        found = `.${current.property.name}${found || ''}`;
        current = current.object;
        if (current.type === 'Identifier') {
          found = `.${current.name}${found || ''}`;
          break;
        }
      }

      obj.jsx = {
        name: jsxnode.openingElement.name.name,
        children: getChildJSXElements(jsxnode, name),
        props: getReactProps(jsxnode, name),
        state: {},
        methods: [],
        iterated: 'forIn',
        source: found.replace('.', ''),
      };
      const propsArr = obj.jsx.props;
      for (let i = 0; i < propsArr.length; i++) {
        for (const key in obj.variables) {
          if (propsArr[i].value.includes(key)) {
            if (obj.variables[key] === '[key]') {
              propsArr[i].value = propsArr[i].value.replace(`.${key}`, obj.variables[key]);
            } else propsArr[i].value = propsArr[i].value.replace(key, obj.variables[key]);
          }
        }
      }
    }
    return obj;
  });
  return result;
}


function forLoopFinder(arr, name) {
  const result = arr.map(ele => {
    const jsxnode = esquery(ele, 'JSXElement')[0];
    const obj = {};
    obj.variables = {};

    // finding variables in case information was reassigned
    esquery(ele, 'VariableDeclarator').forEach(vars => {
      if (vars.id.name !== 'i' && vars.init) {
        obj.variables[vars.id.name] = escodegen.generate(vars.init)
        .replace('this.', '').replace('.length', '');
      }
    });

    // defaulting each iteration to be represented by 'i'
    if (ele.init.declarations) obj.variables[ele.init.declarations[0].id.name] = '[i]';
    else if (ele.init.type === 'AssignmentExpression') obj.variables[ele.init.left.name] = '[i]';

    // building the object name
    if (jsxnode && htmlElements.indexOf(jsxnode.openingElement.name.name)) {
      let current = ele.test.right;
      let found;
      while (current && current.property) {
        found = `.${current.property.name}${found || ''}`;
        current = current.object;
        if (current.type === 'Identifier') {
          found = `.${current.name}${found || ''}`;
          break;
        }
      }

      obj.jsx = {
        name: jsxnode.openingElement.name.name,
        children: getChildJSXElements(jsxnode, name),
        props: getReactProps(jsxnode, name),
        state: {},
        methods: [],
        iterated: 'forLoop',
        source: found.replace('.', '').replace('.length', ''),
      };

      // replacing variables with their properties
      const propsArr = obj.jsx.props;
      for (let i = 0; i < propsArr.length; i++) {
        for (const key in obj.variables) {
          if (propsArr[i].value.includes(key)) {
            if (obj.variables[key] === '[i]') {
              propsArr[i].value = propsArr[i].value.replace(`.${key}`, obj.variables[key]);
            } else propsArr[i].value = propsArr[i].value.replace(key, obj.variables[key]);
          }
        }
      }
    }
    return obj;
  });
  return result;
}

function higherOrderFunctionFinder(arr, name) {
  const result = arr.map(ele => {
    // since every higher order function will have some parameter
    // will be used to replace with what it actually is
    const param = ele.arguments[0].params[0].name;
    const jsxnode = esquery(ele, 'JSXElement')[0];
    const obj = {};
    obj.variables = {};
    esquery(ele, 'VariableDeclarator').forEach(vars => {
      obj.variables[vars.id.name] = escodegen.generate(vars.init);
    });

    if (jsxnode && htmlElements.indexOf(jsxnode.openingElement.name.name)) {
      let current = ele.callee.object;
      let found;
      while (current && current.property) {
        found = `.${current.property.name}${found || ''}`;
        current = current.object;
        if (current.type === 'Identifier') {
          found = `.${current.name}${found || ''}`;
          break;
        }
      }

      obj.jsx = {
        name: jsxnode.openingElement.name.name,
        children: getChildJSXElements(jsxnode, name),
        props: getReactProps(jsxnode, name),
        state: {},
        methods: [],
        iterated: 'higherOrder',
        source: found.replace('.', ''),
      };

      const propsArr = obj.jsx.props;
      for (let i = 0; i < propsArr.length; i++) {
        propsArr[i].value = propsArr[i].value.replace(param, `${obj.jsx.source}[i]`);
        for (const key in obj.variables) {
          if (propsArr[i].value.includes(key)) {
            propsArr[i].value = propsArr[i].value.replace(key, obj.variables[key]);
          }
        }
      }
    }
    return obj;
  });
  return result;
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
 * @returns {Object} Nested object containing name, children,
 * props and state properties of components
 */
function getES5ReactComponents(ast) {
  const output = {
    name: '',
    state: {},
    props: {},
    methods: [],
    children: [],
  };
  let iter = [];
  let topJsxComponent;
  let outside;
  const checker = {};
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
        if (reactMethods.indexOf(prop.key.name) < 0
          && prop.value.type === 'FunctionExpression') {
          output.methods.push(prop.key.name);
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
          state: {},
          methods: [],
        };
      }
    },
  });

  const forIn = esquery(ast, 'ForInStatement').filter(ele => {
    const searched = bfs(ele).filter(n => {
      return n.type === 'JSXElement';
    });
    return searched.length > 0;
  });
  if (forIn.length > 0) iter = iter.concat(forInFinder(forIn, output.name));

  const forLoop = esquery(ast, 'ForStatement').filter(ele => {
    const searched = bfs(ele).filter(n => {
      return n.type === 'JSXElement';
    });
    return searched.length > 0;
  });
  if (forLoop.length > 0) iter = iter.concat(forLoopFinder(forLoop, output.name));

  const higherOrderFunc = esquery(ast, 'CallExpression').filter(ele => {
    let higherOrderChecker = false;
    const searched = bfs(ele).filter(n => {
      return n.type === 'JSXElement';
    });
    if (ele.callee.property && ele.callee.property.name.match(/(map|forEach|filter|reduce)/)) {
      higherOrderChecker = ele.callee.property.name.match(/(map|forEach|filter|reduce)/);
    }
    return searched.length > 0 && higherOrderChecker;
  });
  if (higherOrderFunc.length > 0) {
    iter = iter.concat(higherOrderFunctionFinder(higherOrderFunc, output.name));
  }
  if (outside) output.children.push(outside);
  output.children.forEach((ele, i) => {
    checker[ele.name] = i;
  });

  for (let i = 0; i < iter.length; i++) {
    if (checker.hasOwnProperty(iter[i].jsx.name)) {
      output.children[checker[iter[i].jsx.name]] = iter[i].jsx;
    }
  }

  return output;
}

/**
 * Recursively walks AST and extracts ES6 React component names, child components, props and state
 * @param {ast} ast
 * @returns {Object} Nested object containing name, children,
 * props and state properties of components
 */
function getES6ReactComponents(ast) {
  const output = {
    name: '',
    props: {},
    state: {},
    methods: [],
    children: [],
  };
  let iter = [];
  let outside;
  const checker = {};
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
    // ExpressionStatement(node) {
    //   if (node.expression.left && node.expression.left.property && node.expression.left.property.name === 'state') {
    //     output.state = getReactStates(node.expression.right);
    //   }
    //   this.visitChildren(node);
    // },
    JSXElement(node) {
      // TODO: DO STUFF WITH JSX AFTER FINDING STUFF BOI
      output.children = getChildJSXElements(node, output.name);
      output.props = getReactProps(node, output.name);
      if (htmlElements.indexOf(node.openingElement.name.name) < 0) {
        outside = {
          name: node.openingElement.name.name,
          children: getChildJSXElements(node, output.name),
          props: getReactProps(node, output.name),
          state: {},
          methods: [],
        };
      }
      const forIn = esquery(ast, 'ForInStatement').filter(ele => {
        const searched = bfs(ele).filter(n => {
          return n.type === 'JSXElement';
        });
        return searched.length > 0;
      });
      if (forIn.length > 0) iter = iter.concat(forInFinder(forIn, output.name));

      const forLoop = esquery(ast, 'ForStatement').filter(ele => {
        const searched = bfs(ele).filter(n => {
          return n.type === 'JSXElement';
        });
        return searched.length > 0;
      });
      if (forLoop.length > 0) iter = iter.concat(forLoopFinder(forLoop, output.name));

      const higherOrderFunc = esquery(ast, 'CallExpression').filter(ele => {
        let higherOrderChecker = false;
        const searched = bfs(ele).filter(n => {
          return n.type === 'JSXElement';
        });
        if (ele.callee.property && ele.callee.property.name.match(/(map|forEach|filter|reduce)/)) {
          higherOrderChecker = ele.callee.property.name.match(/(map|forEach|filter|reduce)/);
        }
        return searched.length > 0 && higherOrderChecker;
      });
      if (higherOrderFunc.length > 0) iter = iter.concat(higherOrderFunctionFinder(higherOrderFunc, output.name));
    },
  });

  if (outside) output.children.push(outside);
  output.children.forEach((ele, i) => {
    checker[ele.name] = i;
  });

  for (let i = 0; i < iter.length; i++) {
    if (checker.hasOwnProperty(iter[i].jsx.name)) {
      output.children[checker[iter[i].jsx.name]] = iter[i].jsx;
    }
  }
  return output;
}

/**
 * Recursively walks AST extracts name, child component, and props for a stateless functional component
 * Still a WIP - no way to tell if it is actually a component or just a function
 * @param {ast} ast
 * @returns {Object} Nested object containing name, children, and props properties of components
 */
function getStatelessFunctionalComponents(ast, name) {
  const output = {
    name: name,
    state: {},
    props: {},
    methods: [],
    children: [],
  };

  let iter = [];
  let outside;
  const checker = {};
  esrecurse.visit(ast, {
    ObjectExpression(node) {
      node.properties.forEach(prop => {
        if (reactMethods.indexOf(prop.key.name) < 0
          && prop.value.type === 'FunctionExpression') {
          output.methods.push(prop.key.name);
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
          state: {},
          methods: [],
        };
      }
    },
  });

  const forIn = esquery(ast, 'ForInStatement').filter(ele => {
    const searched = bfs(ele).filter(n => {
      return n.type === 'JSXElement';
    });
    return searched.length > 0;
  });
  if (forIn.length > 0) iter = iter.concat(forInFinder(forIn, output.name));

  const forLoop = esquery(ast, 'ForStatement').filter(ele => {
    const searched = bfs(ele).filter(n => {
      return n.type === 'JSXElement';
    });
    return searched.length > 0;
  });
  if (forLoop.length > 0) iter = iter.concat(forLoopFinder(forLoop, output.name));

  const higherOrderFunc = esquery(ast, 'CallExpression').filter(ele => {
    let higherOrderChecker = false;
    const searched = bfs(ele).filter(n => {
      return n.type === 'JSXElement';
    });
    if (ele.callee.property && ele.callee.property.name.match(/(map|forEach|filter|reduce)/)) {
      higherOrderChecker = ele.callee.property.name.match(/(map|forEach|filter|reduce)/);
    }
    return searched.length > 0 && higherOrderChecker;
  });
  if (higherOrderFunc.length > 0) {
    iter = iter.concat(higherOrderFunctionFinder(higherOrderFunc, output.name));
  }
  if (outside) output.children.push(outside);
  output.children.forEach((ele, i) => {
    checker[ele.name] = i;
  });

  for (let i = 0; i < iter.length; i++) {
    if (checker.hasOwnProperty(iter[i].jsx.name)) {
      output.children[checker[iter[i].jsx.name]] = iter[i].jsx;
    }
  }
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
    if (ast.body[i].type === 'ClassDeclaration') return 'ES6';
    if (ast.body[i].type === 'ExportDefaultDeclaration'
    && ast.body[i].declaration.type === 'ClassDeclaration') return 'ES6';
    if (ast.body[i].type === 'VariableDeclaration' && ast.body[i].declarations[0].init
      && ast.body[i].declarations[0].init.callee
      && ast.body[i].declarations[0].init.callee.object
      && ast.body[i].declarations[0].init.callee.object.name === 'React'
      && ast.body[i].declarations[0].init.callee.property.name === 'createClass') return 'ES5';
  }
  return 'SFC';
}

module.exports = {
  jsToAst,
  componentChecker,
  getES5ReactComponents,
  getES6ReactComponents,
  getStatelessFunctionalComponents,
  forLoopFinder,
  forInFinder,
  higherOrderFunctionFinder,
};

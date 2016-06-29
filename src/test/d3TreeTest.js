'use strict';

const expect = require('chai').expect;
const d3 = require('d3');
const tree = require('../d3Tree/d3Tree.js');
const should = require('chai').should();
const jsdom = require('jsdom');

var document = jsdom.jsdom();
console.log('document: ', document);

var treeData = [
  {
    "name": "Top Level",
    "parent": "null",
    "children": [
      {
        "name": "Level 2: A",
        "parent": "Top Level",
        "children": [
          {
            "name": "Son of A",
            "parent": "Level 2: A"
          },
          {
            "name": "Daughter of A",
            "parent": "Level 2: A"
          }
        ]
      },
      {
        "name": "Level 2: B",
        "parent": "Top Level"
      }
    ]
  }
];




describe("Custom Tree Module", function() {
  it("creates a tree", function() {
    should.exist(tree.createTree)
  })
})
describe("Constructor", function() {
  beforeEach(function() {
    this.tree = tree.createTree(document.body, treeData);
  })
  afterEach(function() {
    this.tree.remove();
  })
  it("returns a function", function() {
    this.tree.should.be.a("function")
  })
})

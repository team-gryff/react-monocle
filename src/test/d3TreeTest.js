'use strict';

const expect = require('chai').expect;
const should = require('chai').should();
const jsdom = require('jsdom');

const tree = require('../d3Tree/d3Tree.js');
const treeData = require('./fixtures/d3TreeFixtures.js').testData1;

describe("d3 React Tests", function() {
  it('should create tree', function() {
    jsdom.env('<body></body', function (err, window) {
      
    });
  });
})

const d3 = require('d3');
const jsdom = require('jsdom');
const tree = require('../src/d3Tree/d3Tree.js');

describe('Test D3.js with jasmine ', function() {
  var c;

  beforeEach(function() {
    c = barChart();
    c.render();
  });

  afterEach(function() {
    d3.selectAll('svg').remove();
  });

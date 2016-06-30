const d3Tree = require('./d3Tree.js');

d3Tree.create(
  document.body, 
  require('../test/fixtures/d3TreeFixtures.js').testData1
);

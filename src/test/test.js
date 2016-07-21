global.window = window;
describe('react-monocle Test Suite', function() {
  require('./reactParserTest.js');
  require('./astGeneratorTest.js');
  require('./d3DataBuilderTest.js');
  require('./previewParserTest.js');
  require('./reactInterceptorTest.js');
  // require('./d3TreeTest.js'); need to investigate how to test with headless browser
});

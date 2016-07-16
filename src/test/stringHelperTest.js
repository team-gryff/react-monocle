const expect = require('chai').expect;

describe('String Helper Utility Tests', function() {
  describe('regexLastIndexOf Tests', function() {
    const regexLastIndexOf = require('../stringRegexHelper.js').regexLastIndexOf;

    it('should return a valid function', function() {
      expect(regexLastIndexOf).to.be.a('function');
    });

    it('should find hello word pattern and return index of 0', function() {
      const input = 'hello hello world';
      expect(regexLastIndexOf(input, /hello/, 11)).to.equal(6);
    });
  });
});
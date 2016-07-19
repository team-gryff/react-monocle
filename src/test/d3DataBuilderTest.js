'use strict';
const expect = require('chai').expect;
const assign = require('lodash.assign');
const d3DataBuilder = require('../d3DataBuilder');
const astGenerator = require('../astGenerator')


describe('d3DataBuilder Unit Tests', function() {

  const app = __dirname + '/fixtures/test_components/app.jsx';
  const BIG = __dirname + '/fixtures/test_components/BIG.jsx';
  const Biggie = __dirname + '/fixtures/test_components/Biggie.jsx';
  const BigPoppa = __dirname + '/fixtures/test_components/BigPoppa.jsx';
  const Notorious = __dirname + '/fixtures/test_components/Notorious.jsx';
  let parseComponents = [app, BIG, Biggie, BigPoppa, Notorious].map(ele => {return astGenerator(ele)});
  const astObj = assign.apply(null, parseComponents), 
        d3Obj = d3DataBuilder(astObj);


  it('should be a function', function() {
    expect(d3DataBuilder).to.be.a.function;
  })

  it('should return an object', function() {
    expect(d3Obj).to.be.an('object');
  })

  it('should have all components as field properties on object returned', function() {
    expect(d3Obj['BIG']).to.exist;
    expect(d3Obj['Biggie']).to.exist;
    expect(d3Obj['BigPoppa']).to.exist;
    expect(d3Obj['Notorious']).to.exist;
  });

  it('should have child length of 2 for BigPoppa and child length of 1 for Notorious components', function() {
    expect(d3Obj['BigPoppa'].children.length).to.equal(2);
    expect(d3Obj['Notorious'].children.length).to.equal(1);
  });

  /** 
   * Below unit tests should be deprecated to account for breaking 
   * change in formatting structure of returned d3 data object
   */
  xit('should start with the correct component', function() {
    expect(d3Obj.name).to.equal('BigPoppa');
  })

  xit('should have component nesting', function() {
    expect(d3Obj.children.length).to.equal(2);
    expect(d3Obj.children[0].children.length).to.equal(1);
  })

  xit('should account for props', function() {
    expect(d3Obj.children[0].props.length).to.equal(3);
    expect(d3Obj.children[0].children[0].props.length).to.equal(2);
  })

  xit('should account for state', function() {
    expect(d3Obj).to.deep.equal(require('./fixtures/dummyTree'));
  })

})
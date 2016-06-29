#!/usr/bin/env node
const program = require('commander');
const glob = require('glob');
const astGenerator = require('../src/astGenerator.js');
const assign = require('lodash.assign');


program.arguments('<entry>')
  .action(function(entry){
    glob('**/*.jsx', {nosort:true, ignore: 'node_modules/**'}, (err, files) => {
      console.log(files);
      const astz = files.map(ele => {return astGenerator(ele)})
      const componentObject = assign.apply(null, astz);
    })
  })
  .parse(process.argv);



#!/usr/bin/env node
'use strict'
const program = require('commander');
const glob = require('glob');
const astGenerator = require('../src/astGenerator');
const assign = require('lodash.assign');
const d3DataBuilder = require('../src/d3DataBuilder')

// specifying one required parameter
program
  .option('-e, --entry <entry>', 'App entry point. Defaults to JSX file where ReactDOM.render is found.')
  .option('-d, --directory <directory>', 'directory of React files. Defaults to where Monocle was called.')
  .option('-j, --extension <extension>', 'extension of React files (jsx or js). Defaults to .jsx (only use when specifying/in directory which has your React files!)')
  .parse(process.argv);


(function() {
  const entry = program.entry || null;
  const directory = program.directory || process.cwd();
  const ext = program.extension || 'jsx';
  // globs to match any jsx in directory called
  glob(`**/*.${ext}`, {cwd: directory, nosort:true, ignore: 'node_modules/**'}, (err, files) => {
    const astz = files.map(ele => {return astGenerator(ele)})
    const componentObject = assign.apply(null, astz); // combining into one file
    if (entry) componentObject.ENTRY = astGenerator(entry);
    const formatedD3Object = d3DataBuilder(componentObject);
    console.log(formatedD3Object);
  })
})()

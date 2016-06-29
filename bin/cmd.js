#!/usr/bin/env node
'use strict'
const program = require('commander');
const glob = require('glob');
const astGenerator = require('../src/astGenerator.js');
const assign = require('lodash.assign');

// specifying one required parameter
program
  .option('-e, --entry <entry>', 'App entry point. Defaults to JSX file where ReactDOM.render is found.')
  .option('-d, --directory <directory>', 'directory of React files. Defaults to where Monocle was called.')
  .option('-f, --extension <extension>', 'extension of React files. Defaults to .jsx (only use when specifying/in directory which has your React files!)')
  .action(function(options){
    let entry = options.entry || null;
    let directory = options.directory || process.cwd();
    let ext = options.extension || 'jsx';
    // globs to match any jsx in directory called
    glob(`**/*.${ext}`, {cwd: directory, nosort:true, ignore: 'node_modules/**'}, (err, files) => {
      const astz = files.map(ele => {return astGenerator(ele)})
      const componentObject = assign.apply(null, astz); // combining into one file
      if (entry) componentObject.ENTRY = astGenerator(entry);
    })
  })
  .parse(process.argv);



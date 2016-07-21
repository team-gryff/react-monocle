#!/usr/bin/env node
'use strict';
const program = require('commander');
const glob = require('glob');
const astGenerator = require('../src/astGenerator');
const assign = require('lodash.assign');
const d3DataBuilder = require('../src/d3DataBuilder');
const renderHtml = require('../src/d3Tree/renderHtml');
const previewParser = require('../src/previewParser');
const htmlParser = require('../src/htmlParser');
const start = Date.now();

// specifying one required parameter
program
  .option('-h --html <html>', 'HTML page which has your bundle and css files')
  .option('-b, --bundle <bundle>', '**Required** Path to react bundle file')
  .option('-e, --entry <entry>', 'App entry point. Defaults to JSX file where ReactDOM.render is found.')
  .option('-d, --directory <directory>', 'directory of React files. Defaults to where Monocle was called.')
  .option('-j, --extension <extension>', 'extension of React files (jsx or js). Defaults to .jsx (only use when specifying/in directory which has your React files!)')
  .parse(process.argv);

program.name = 'monocle';

(function () {

  let bundle = null;
  let entry = null;
  let htmlElements;
  let directory = process.cwd();
  if (!program.html) throw new Error('    --html | -h required    ');
  else htmlElements = htmlParser(program.html, program.bundle);
  if (!program.bundle) {
    throw new Error('    --bundle | -b required    ');
  } else {
    bundle = `${process.cwd()}/${htmlElements.bundle}`;
  }
  if (program.entry) entry = `${process.cwd()}/${program.entry}`;
  if (program.directory) directory = `${process.cwd()}/${program.directory}`;
  const ext = program.extension || 'jsx';
  // bundle = previewParser.modifyBundleFile(bundle);
  let modifiedBundle = previewParser.modifySetStateStrings(bundle);
  modifiedBundle = previewParser.modifyInitialState(modifiedBundle);
  const divsArr = previewParser.getDivs(modifiedBundle);
  // globs to match any jsx in directory called
  // `**/*.js*` for both js and jsx
  glob(`**/*.${ext}`, { cwd: directory, nosort: true, ignore: ['node_modules/**', 'react/**'] }, (err, files) => { // TODO: CHANGE BACK
    if (files.length === 0) throw new Error('No files found (try specifying file path and extension)');
    if (directory !== process.cwd()) files = files.map(ele => `${process.cwd()}/${program.directory}/${ele}`);

    // converting file paths to abstract syntax trees (output is an array with {ComponentName: AST} objects)
    const astz = files.map(ele => astGenerator(ele));
    let componentObject = assign.apply(null, astz); // combining into one file
    if (entry) componentObject = assign(componentObject, astGenerator(entry, true));
    const formatedD3Object = d3DataBuilder(componentObject); // building the tree
    renderHtml(formatedD3Object, modifiedBundle, start, divsArr, htmlElements.scripts, htmlElements.css); // sending the completed tree to be built and rendered
  });
})();

'use strict';
const fs = require('fs');


function htmlParser(path, bundle) {
  const stringed = fs.readFileSync(path, { encoding: 'utf-8' });

  const result = findJavaScript(stringed, bundle, path.replace(/\/.*?\.html/, '').replace(/\/?.*?\.html/, ''));
  result.css = findCSS(stringed, path.replace(/\/.*?\.html/, '').replace(/\/?.*?\.html/, ''));

  return result;
}

function findCSS(str, relPath) {
  if (relPath !== '') relPath = relPath + '/';
  const styleTags = str.match(/<style>(\n|.)*?(<\/style>)/g) || [''];
  const cssLinks = str.match(/<link.*?css.*?>/g);
  if (!cssLinks && !styleTags) return [];
  if (!cssLinks) return styleTags;
  return cssLinks.map(ele => {
    if (!ele) return;
    if (ele.search(/http/) !== -1) return ele;
    if (ele.search(/href(\s?)=(\s?)(\\?)('|")\/{2}/) && ele.includes('www')) {
      const insertIndex = ele.indexOf('//');
      return `${ele.slice(0, insertIndex)}https:${ele.slice(insertIndex)}`;
    } else {
      let cssFile = relPath + ele.match(/href(\s?)=(\s?)(\\?)('|").*?(\\?)('|")/g)[0]
      .match(/(\\?)('|").*?(\\?)('|")/g)[0]
      .replace(/\\/g, '')
      .replace(/'/g, '')
      .replace(/"/g, '');
      if (cssFile[0] === '/') cssFile = cssFile.slice(1);
      const cssFileString = fs.readFileSync(`${process.cwd()}/${cssFile}`, { encoding: 'utf-8' });
      if (!cssFileString) throw new Error(`Invalid CSS file path found (${cssFile})`);
      return `<style>${cssFileString}</style>`;
    }
  })
  .concat(styleTags);
}

function findJavaScript(str, bundle, relPath) {
  if (relPath !== '') relPath = relPath + '/';
  const result = {
    bundle: '',
    scripts: [],
  };
  const scriptz = str.match(/<script.*?<\/script>/g);
  if (!scriptz) throw new Error('Was not able to find script tags in HTML.');
  scriptz.forEach(ele => {
    if (!ele) return;
    if (ele.includes(bundle)) {
      result.bundle = relPath + ele.match(/src(\s?)=(\s?)(\\?)('|").*?(\\?)('|")/g)[0]
      .match(/(\\?)('|").*?(\\?)('|")/g)[0]
      .replace(/\\/g, '')
      .replace(/'/g, '')
      .replace(/"/g, '')
      .trim();
      if (result.bundle[0] === '/') result.bundle = result.bundle.slice(1);
    } else if (ele.search(/src(\s?)=(\s?)(\\?)('|").*?(\\?)('|")/ === -1) || ele.search(/http/) !== -1) result.scripts.push(ele);
  });
  return result;
}


module.exports = htmlParser;

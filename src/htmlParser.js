'use strict';
const fs = require('fs');


function htmlParser(path, bundle) {
  const stringed = fs.readFileSync(path, { encoding: 'utf-8' });

  const result = findJavaScript(stringed, bundle);
  result.css = findCSS(stringed);

  return result;
}

function findCSS(str) {
  const styleTags = str.match(/<style>(\n|.)*?(<\/style>)/g);
  const cssLinks = str.match(/<link.*stylesheet.*?>/g);
  if (!cssLinks && !styleTags) return [];
  if (!cssLinks) return styleTags; 
  return cssLinks.map(ele => {
    if (ele.search(/http/) !== -1) return ele;
    else {
      const cssFile = ele.match(/href(\s?)\=(\s?)(\\?)(\'|\").*?(\\?)(\'|\")/g)[0]
      .match(/(\\?)(\'|\").*?(\\?)(\'|\")/g)[0]
      .replace(/\\/g, '')
      .replace(/\'/g, '')
      .replace(/\"/g, '');
      return `<style>${fs.readFileSync(cssFile, { encoding: 'utf-8' })}</style>`;
    }
  })
  .concat(styleTags);
}


function findJavaScript(str, bundle) {
  const result = {
    bundle: '',
    scripts: [],
  };

  const scriptz = str.match(/<script.*?<\/script>/g);
  scriptz.forEach(ele => {
    if (ele.includes(bundle)) {
      result.bundle = ele.match(/src(\s?)\=(\s?)(\\?)(\'|\").*?(\\?)(\'|\")/g)[0]
      .match(/(\\?)(\'|\").*?(\\?)(\'|\")/g)[0]
      .replace(/\\/g, '')
      .replace(/\'/g, '')
      .replace(/\"/g, '')
      .trim();
    } 
    else if (ele.search(/src(\s?)\=(\s?)(\\?)(\'|\").*?(\\?)(\'|\")/ === -1) || ele.search(/http/) !== -1) result.scripts.push(ele);
  });
  return result;
}


module.exports = htmlParser;

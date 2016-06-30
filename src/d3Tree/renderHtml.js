const d3Tree = require('./d3Tree.js');
const fs = require('fs');
const appRoot = require('app-root-path');
const DEV_MODE = true;


function renderHtml(d3Obj) {
  const treeHtmlPath = DEV_MODE ? '/src/d3Tree/d3Tree.html' : '/node_modules/react-monocle/src/d3Tree/d3Tree.html';
  const d3libPath = DEV_MODE ? '/node_modules/d3/d3.min.js' : '/node_modules/react-monocle/node_modules/d3/d3.min.js';
  const treeLogicPath = DEV_MODE ? '/src/d3Tree/d3Tree.js' : '/node_modules/react-monocle/src/d3Tree/d3Tree.js';
  const endHtmlPath = DEV_MODE ? '/src/d3Tree/end.html' : '/node_modules/react-monocle/src/d3Tree/end.html';

  const treeHtml = fs.readFileSync(appRoot + treeHtmlPath);
  const d3lib = fs.readFileSync(appRoot + d3libPath);
  const treeLogic = fs.readFileSync(appRoot + treeLogicPath);
  const endHtml = fs.readFileSync(appRoot + endHtmlPath);
  const insert = `${treeHtml} \n <script type="text/javascript"> \n ${d3lib} \n </script>`
  + `<script type="text/javascript"> \n var d3Obj = ${d3Obj} \n ${treeLogic} \n </script> \n ${endHtml}`;
  fs.writeFile(appRoot + '/react-monocle.html', insert, err => {
    console.log(err);
  });
}

module.exports = renderHtml

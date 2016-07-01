const fs = require('fs');


function renderHtml(d3Obj) {
  const treeHtmlPath = '/src/d3Tree/d3Tree.html';
  const d3libPath = '/node_modules/d3/d3.min.js';
  const treeLogicPath = '/src/d3Tree/d3Tree.js';
  const endHtmlPath = '/src/d3Tree/end.html';

  const treeHtml = fs.readFileSync(appRoot + treeHtmlPath, {encoding:'utf-8'});
  const d3lib = fs.readFileSync(appRoot + d3libPath, {encoding:'utf-8'});
  const treeLogic = fs.readFileSync(appRoot + treeLogicPath, {encoding:'utf-8'});
  const endHtml = fs.readFileSync(appRoot + endHtmlPath, {encoding:'utf-8'});
  const insert = `${treeHtml} \n <script type="text/javascript"> \n ${d3lib} \n </script>`
  + `<script type="text/javascript"> \n var d3Obj = ${JSON.stringify(d3Obj)} \n ${treeLogic} \n </script> \n ${endHtml}`;
  fs.writeFile(process.cwd() + '/react-monocle.html', insert, err => {
    if (err) console.log(err);
  });
}

module.exports = renderHtml

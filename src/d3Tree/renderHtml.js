const fs = require('fs');
const appRoot = require('app-root-path');
const exec = require('child_process').exec;


function renderHtml(d3Obj, bundle, start, arr) {
  const treeHtmlPath = '/src/d3Tree/d3Tree.html',
    treeLogicPath = '/src/d3Tree/app.js',
    hookLogicPath = '/src/d3Tree/hooks.js',
    endHtmlPath = '/src/d3Tree/end.html',
    treeHtml = fs.readFileSync(appRoot + treeHtmlPath, { encoding: 'utf-8' }),
    treeLogic = fs.readFileSync(appRoot + treeLogicPath, { encoding: 'utf-8' }),
    hookLogic = fs.readFileSync(appRoot + hookLogicPath, { encoding: 'utf-8' }),
    endHtml = fs.readFileSync(appRoot + endHtmlPath, { encoding: 'utf-8' }),
    insert = `${treeHtml} 
              ${arr.join('') || '<div></div>'} 
              </div> 
              <script type="text/javascript"> 
                ${hookLogic}
                ${bundle} 
                var formatted = ${JSON.stringify(d3Obj, null, 2)} 
                ${treeLogic}
              </script>
              ${endHtml}`;
    fs.writeFile(`${process.cwd()}/react-monocle.html`, insert, err => {
    if (err) throw new Error(err);
    exec(`open ${process.cwd()}/react-monocle.html`, (error, stdout, stderr) => {
      if (error !== null) throw new Error(error);
      if (stderr !== '') throw new Error(stderr);
      else console.log(`Parsed in ${Date.now() - start}ms.
Look in ${process.cwd()} to find react-monocle.html.`);
    });
  });
}

module.exports = renderHtml;

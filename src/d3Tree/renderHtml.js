'use strict'
const fs = require('fs');
const appRoot = require('app-root-path');
const exec = require('child_process').exec;


function renderHtml(d3Obj, bundle, start, arr, scripts, css) {
  let cssStyles = '';
  let inlineScripts = '';

  scripts.forEach(ele => {
    inlineScripts += ele;
  })

  css.forEach(ele => {
    cssStyles += ele;
  });

  const treeLogicPath = '/src/d3Tree/app.js',
    hookLogicPath = '/src/d3Tree/hooks.js',
    endHtmlPath = '/src/d3Tree/end.html',
    treeHtml = htmlTop(cssStyles),
    treeLogic = fs.readFileSync(appRoot + treeLogicPath, { encoding: 'utf-8' }),
    hookLogic = fs.readFileSync(appRoot + hookLogicPath, { encoding: 'utf-8' }),
    endHtml = htmlBottom(inlineScripts),
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

function htmlTop(css) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>React Monocle</title>
	<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>

    <style>
    #monocle-content {
      font-family: 'Roboto', sans-serif;
      background-color: #FAFAFA;
    }

  	#monocle-content .link {
  	  fill: none;
  	  stroke: #455A64;
  	  stroke-width: 2px;
			transition: stroke-width 0.7s ease, stroke 0.7s ease;
  	}

    #monocle-content .highlight {
      stroke: #01FFD5;
      stroke-width: 16px;
    }

    #monocle-content .propchange {
      stroke: #01FFD5;
      stroke-width: 20px;
    }

		#monocle-content #graph {
			width: 100%;
			height: 100%;
		}


    #flex-container {
      display: flex;
    }

		#flex-container > div:nth-child(2){
      padding-left: 25px;
      border-left: 1px solid gray;
    }

  </style>
  ${css}
  
</head>

<body>
	<div id="flex-container">
		<div id="monocle-content"></div>`
}

function htmlBottom(scripts) {
  return `
  ${scripts}
  </body>
</html>
`
}



module.exports = renderHtml;

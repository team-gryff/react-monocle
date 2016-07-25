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

  ${css}
    <style>
    body {
      margin: 0;
      padding: 0;
    }

    #monocle-content {
      font-family: 'Roboto', sans-serif;
      background-color: #2D2D2D;
      padding: 35px 0 0 5px;
    }

  	#monocle-content .link {
  	  fill: none;
  	  stroke: #969696;
  	  stroke-width: 2px;
			transition: stroke-width 0.7s ease, stroke 0.7s ease;
  	}

    #monocle-content .highlight {
      stroke: #969696;
      stroke-width: 5px;
    }

    #monocle-content .propchange {
      stroke: #FF5601;
      stroke-width: 12px;
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

    #monocle-content::-webkit-scrollbar {
      width:5px;
    }

#monocle-content::-webkit-scrollbar-track-piece:start {
    background: transparent url('http://cdn2.packshot-creator.com/sites/all/themes/basic/images/interface/grid.png') repeat-y !important;
}

#monocle-content::-webkit-scrollbar-track-piece:end {
    background: transparent url('http://cdn2.packshot-creator.com/sites/all/themes/basic/images/interface/grid.png') repeat-y !important;
}

    #monocle-content::-webkit-scrollbar-thumb {
      background:rgba(255,0,0,0.1); !important;
    }

  </style>
  
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

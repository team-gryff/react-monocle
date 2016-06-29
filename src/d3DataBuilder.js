'use strict';
const reactParser = require('./reactParser');



function d3DataBuilder(obj) {
  const ENTRY = obj.ENTRY;
  
  const formated = {};

  for (let key in obj) {
    if (key === 'ENTRY') continue;
    if (reactParser.isES6ReactComponent(obj[key])) {
      formated[key] = reactParser.getES6ReactComponents(obj[key]);
    } else {
      formated[key] = reactParser.getES5ReactComponents(obj[key]);
    }
  }

  console.log(formated);



  return;
}



module.exports = d3DataBuilder;

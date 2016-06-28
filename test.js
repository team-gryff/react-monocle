const babel = require('babel-core');
const fs = require('fs')



const data = babel.transformFileSync('./App.jsx').code;


fs.writeFile('example.js', JSON.stringify(data), err => {
  if (err) throw err;
  console.log('saved');
})
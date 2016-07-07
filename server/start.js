// Server-side entrypoint that registers Babel's require() hook
const babelRegister = require('babel-register');
babelRegister();

require('./server');
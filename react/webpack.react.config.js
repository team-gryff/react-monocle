const webpack = require('webpack');


module.exports = {
  entry: {
    'reactd3.bundle': [
      './index',
    ],
  },
  // This will not actually create a bundle.js file in ./client. It is used
  // by the dev server for dynamic hot loading.
  output: {
    path: __dirname,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel-loader'],
      exclude: /node_modules/,
    },
    ],
  },
  plugins: [
    // new ExtractTextPlugin('style.css', { allChunks: true })
    // new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      comments: false,
    }),
  ],
};

const webpack = require('webpack');


module.exports = {
  devtool: 'source-map',
  entry: './react/index.jsx',
  output: {
    path: __dirname + '/client/',
    filename: 'app.js',
    publicPath: 'http://localhost:9090/client/',
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
    // {
    //   loader: 'uglify',
    // },
    ],
  },
  plugins: [
    // new ExtractTextPlugin('style.css', { allChunks: true })
    new webpack.DefinePlugin({
      NODE_ENV: 'production',
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
    }),
  ],
};

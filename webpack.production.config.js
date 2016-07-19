const webpack = require('webpack');


module.exports = {
  entry: {
    app: './react/index.jsx',
    hooks: './react/hooks.jsx',
  },
  output: {
    path: __dirname + '/src/d3Tree/',
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
    // {
    //   loader: 'uglify',
    // },
    ],
  },
  plugins: [
    // new ExtractTextPlugin('style.css', { allChunks: true })
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
    }),
  ],
};

var webpack = require('webpack');
var history = require('connect-history-api-fallback');
var express = require('express');

var PLUGINS = [];
if (process.env.NODE_ENV === 'production') {
  PLUGINS.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'build/build.js'
  },
  plugins: PLUGINS,
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    before: function(app, server) {
      app.use(history({
        rewrites: [
          // Redirect URLs with a wallet address pattern to index.html
          { from: /^\/[0-9a-fA-F]{40}$/, to: '/index.html' }
        ]
      }));
      app.use(express.static(__dirname));
    }
  }
};

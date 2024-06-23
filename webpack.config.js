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
    historyApiFallback: {
      rewrites: [
        // Redirect URLs with a walletAddress query parameter to index.html
        { from: /\/\?walletAddress=0x[0-9a-fA-F]{40}$/, to: '/index.html' }
      ]
    },
    before: function(app, server) {
      app.use(express.static(__dirname));
    }
  }
};

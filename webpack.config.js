var webpack = require('webpack');
var path = require("path");

module.exports = {
  entry: ["./ch1/client.js"],
  output: {
    path: __dirname + '/build',
    // path: path.join(__dirname, 'dist'),
    //  filename: "[name].js"
    filename: './bundle.js'
  },
  module: {
    //代码严格审查这步大概需要2-3秒
    /*preLoaders: [{
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/
    }],*/
    loaders: [{
        test: /\.css$/,
        loader: "style!css"
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/, //写明路径,速度快一倍
        query: {
          presets: ['es2015', 'react']
            //presets: ["babel-fast-presets/es2015-stage1", "react"] //用这个可以快2-5秒
        }
      }

    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extensions: [' ', '.js', '.json']
  },
  node: {
    fs: "empty"
  },
  devServer: {
    port: 8091,
    host: 'localhost',
  },
};
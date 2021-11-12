var debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');

module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./index.js",
    resolve: {
      extensions: ['.js']
    },
    // module: {
    // rules: [{
    //     test: /\.js$/,
    //     use: 'babel-loader'
    //   }]
    // },
    output: {
      path: __dirname + "public/javascripts",
    //   filename: "scripts.min.js"
    },
    plugins: debug ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
  };
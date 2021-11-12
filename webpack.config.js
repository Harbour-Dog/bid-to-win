var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: path.join(__dirname, "public"),
    devtool: debug ? "inline-sourcemap" : false,
    entry: "./src/index.js",
    // module: {
    //     loaders: [
    //         {
    //             test: /\.jsx?$/,
    //             exclude: /(node_modules|bower_components)/,
    //             loader: 'babel-loader',
    //             query: {
    //                 presets: ['react', 'es2016', 'stage-0'],
    //                 plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
    //             }
    //         }
    //     ]
    // },
    // output: {
    //     path: __dirname + "/public/",
    //     filename: "build.js"
    // },
    // plugins: debug ? [] : [
    //     new webpack.optimize.DedupePlugin(),
    //     new webpack.optimize.OccurrenceOrderPlugin(),
    //     new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    // ],
};
var path = require('path');
var webpack = require('webpack');
module.exports = {
  //context: "./src/",
  entry: {
    'embedNCNRData': './embed.js'
  },
  output: {
    filename: '../js/[name].js',
    libraryTarget: 'var', 
    library: 'NCNRDataLoader'
  },
  module: {
    loaders: [
        //{ test: path.join(__dirname, 'src'), loader: 'babel-loader' },
        { test: /\.js$/, loader: 'babel-loader' },
        { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin() // to make small...
  ]
};

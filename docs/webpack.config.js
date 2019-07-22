var path = require("path");
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: "./main.jsx",
  output: {
    path: path.resolve(__dirname, './'),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'env']
        }
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: [".js", ".jsx", "*"],
  },
  plugins:[
    new webpack.NamedModulesPlugin(),
  ]
};
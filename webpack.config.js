const path = require('path');
const public = 'docs';

module.exports = {
  entry: {
    '../dist/index': './src/_site/index-esm.tsx',
    'dist/app': './src/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, public),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /.tsx?$/, loader: 'ts-loader' },
      { test: /\.js$/, use: ["source-map-loader"], enforce: "pre" }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, public),
    open: true,
    historyApiFallback: {
      index: 'dev.html'
    }
  },
  devtool: 'source-map'
}
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'bundles'),
    publicPath: "/",
    filename: 'ngx-gdeic.umd.js',
    libraryTarget: 'umd',
    library: 'ngx-gdeic'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  externals: [/^\@angular\//, /^rxjs\//],
  module: {
    rules: [{
      test: /\.ts$/,
      use: [
        'awesome-typescript-loader'
      ]
    }, {
      test: /\.html$/,
      use: [
        'html-loader'
      ]
    }, {
      test: /\.css/,
      use: [
        'raw-loader'
      ]
    }]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: true
    })
  ],
  devtool: "eval-source-map"
};

const path = require('path')
const WebpackNotifierPlugin = require('webpack-notifier')
const HtmlWebpackPlugin = require('html-webpack-plugin')

process.noDeprecation = true

module.exports = {
  entry: {
    'index': './src/js/index.js',    
    'suggestrap': './src/js/suggestrap.js',
    '../test/browser-test': './src/test/browser-test.js',
    '../test/test-server': './src/test/test-server.js',
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: [ 'node_modules', path.resolve('./src/'),  ],
    extensions: ['.js', 'scss'],
  },
  externals: [
    'http',
    'fs',
    'path',
  ],
  plugins: [
    new WebpackNotifierPlugin({title: 'suggestrap'}),
    new HtmlWebpackPlugin({
      filename: '../test/index.html',
      template: './src/test/index.pug',
      chunks: [],
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        loader: ['pug-loader']
      }
    ]
  }
}
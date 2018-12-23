const path = require('path')
const WebpackNotifierPlugin = require('webpack-notifier')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LicenseInfoWebpackPlugin = require('license-info-webpack-plugin').default;

const node = {
  entry: {
    '../test/test-server': './src/test/test-server.js',
    'index': './src/js/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: [ 'node_modules', path.resolve('./src/'),  ],
  },
  externals: [
    'http',
    'fs',
    'path',
    'superagent',
    'lodash',
  ],
  target: "node",
  plugins: [
    new WebpackNotifierPlugin({ title: 'suggestrap node' }),
    new LicenseInfoWebpackPlugin({ glob: '{LICENSE,license,License}*' }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: {
          loader: 'url-loader'
        }
      }
    ]
  }  
}

const web = {
  entry: {
    'suggestrap': './src/js/index.js',
    '../test/browser-test': './src/test/browser-test.js'
  },
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    library: 'Suggestrap',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  resolve: {
    modules: ['node_modules', path.resolve('./src/'),],
  },
  target: "web",
  plugins: [
    new WebpackNotifierPlugin({ title: 'suggestrap web' }),
    new LicenseInfoWebpackPlugin({ glob: '{LICENSE,license,License}*' }),
    new HtmlWebpackPlugin({
      filename: '../test/index.html',
      template: './src/test/index.pug',
      chunks: [],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
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

module.exports = [ node, web ]
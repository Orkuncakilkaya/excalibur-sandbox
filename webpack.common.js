const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { sveltePreprocess } = require('svelte-preprocess/dist/autoProcess')

module.exports = {
  entry: './src/index.ts',
  target: 'web',
  output: {
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        exclude: [path.resolve(__dirname, 'node_modules/excalibur')],
        enforce: 'pre',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(svelte)$/,
        use: {
          loader: 'svelte-loader',
          options: {
            preprocess: sveltePreprocess(),
          },
        },
      },
      {
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.svelte'],
    alias: {
      svelte: path.resolve('node_modules', 'svelte/src/runtime'),
    },
    mainFields: ['svelte', 'browser', 'module', 'main'],
    conditionNames: ['svelte', 'browser', 'import'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: './assets/style.css', to: 'style.css' }],
    }),
    new HtmlWebPackPlugin({
      title: 'Excalibur Webpack Sample',
      template: './assets/index.html',
      hash: true,
    }),
  ],
}

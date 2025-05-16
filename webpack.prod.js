const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
plugins: [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new WorkboxWebpackPlugin.GenerateSW({
    swDest: 'sw.js', // Nama file Service Worker hasil build
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff2?|eot|ttf|otf)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-resources',
        },
      },
      {
        urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 3,
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  }),
],
});

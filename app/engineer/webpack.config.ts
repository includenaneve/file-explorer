/// <reference path="../types/index.d.ts" />

import webpack, { Configuration } from 'webpack';
import { APP_ENTRY_PATH, OUTPUT_DIR, LOADER_MODULE_PATH } from './path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
const BabelPluginImport = require('babel-plugin-import');

export interface ConfigOptions {
  mode: Configuration['mode'];
}

export const config = function({ mode }: ConfigOptions): Configuration {
  const isDev = mode === 'development';
  return {
    mode: mode,
    entry: {
      app: [ APP_ENTRY_PATH, 'webpack-hot-middleware/client' ]
    },
    output: {
      filename: isDev ? 'app.js' : 'app.[chunkhash:10].js',
      path: OUTPUT_DIR,
      publicPath: '/assets',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loaders: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  isDev && require.resolve('react-refresh/babel'),
                  [require.resolve('babel-plugin-import'), {
                    'libraryName': 'antd',
                    libraryDirectory: 'lib',
                    style: true
                  }]
                ].filter(Boolean),
              }
            },     
            {
              loader: 'ts-loader'
            },
          ]
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader',  {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
          }
          }]
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        }
      ]
    },
    resolveLoader: {
      modules: [LOADER_MODULE_PATH]
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    plugins: [
      // perferEntry ???
      new webpack.optimize.OccurrenceOrderPlugin(false),
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
    ].filter(Boolean)
  }
}
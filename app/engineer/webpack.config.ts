import webpack, { Configuration } from 'webpack';
import { APP_ENTRY_PATH, OUTPUT_DIR } from './path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';


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
                  isDev && require.resolve('react-refresh/babel')
                ].filter(Boolean),
              }
            },
            {
              loader: 'ts-loader'
            },
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    plugins: [
      // perferEntry ???
      isDev && new webpack.optimize.OccurrenceOrderPlugin(false),
      isDev && new webpack.HotModuleReplacementPlugin(),
      isDev && new ReactRefreshWebpackPlugin()
    ].filter(Boolean)
  }
}
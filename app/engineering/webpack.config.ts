import path from 'path';
import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { Configuration } from 'webpack';
import { SRC_ROOT, APP_ROOT, APP_ENTRY_PATH, APP_OUTPUT_DIR } from './paths';

export const config = function(
  { mode }: { 
    mode: "development" | "production" | "none"; 
  }): Configuration {
  return {
    mode: mode,
    entry: {
      // app 入口
      app: ['webpack-hot-middleware/client', APP_ENTRY_PATH],
    },
    output: {
      // 输出的文件名与路径
      filename: mode === 'development' ? 'app.js' : 'app.[chunkhash:10].js',
      path: APP_OUTPUT_DIR,
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
                  mode === 'development' && require.resolve('react-refresh/babel'),
                ].filter(Boolean)
              }
            },
            {
              loader: 'ts-loader',
            }
          ]
        }
      ],
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(false),
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin({
        overlay: {
          sockIntegration: 'whm'
        }
      })
    ],
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
    }
  }
}
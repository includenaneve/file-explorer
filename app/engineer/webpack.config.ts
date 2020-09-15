import { Configuration } from 'webpack';
import { APP_ENTRY_PATH, OUTPUT_DIR } from './path';


export interface ConfigOptions {
  mode: Configuration['mode'];
}

export const config = function({ mode }: ConfigOptions): Configuration {
  const isDev = mode === 'development';
  return {
    mode: mode,
    entry: {
      app: APP_ENTRY_PATH
    },
    output: {
      filename: isDev ? 'app.js' : 'app.[chuckhash:10].js',
      path: OUTPUT_DIR,
      publicPath: '/assets',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loaders: [
            {
              loader: 'babel-loader'
            },
            {
              loader: 'ts-loader'
            },
          ]
        }
      ]
    },
  }
}
import webpack from 'webpack';
import webpackDevMiddleWare from 'webpack-dev-middleware';
import webpackHotMiddleWare from 'webpack-hot-middleware';
import { config } from './webpack.config';

export function wdm() {
  const devConfig = config({
    mode: 'development'
  });
  const compiler = webpack(devConfig);

  return [
    webpackDevMiddleWare(compiler, {
      publicPath: devConfig.output?.publicPath,
      reporter: (_, { stats, log }) => {
        if (stats) {
          if (stats.hasErrors()) {
            log.error(stats.toString("minimal"));
          } else if (stats.hasWarnings()) {
            log.warn(stats.toString("minimal"));
          }
        }
      },
    }),
    webpackHotMiddleWare(compiler, {
      log: () => {
        console.log('hot module reload~');
      },
      heartbeat: 10 * 1000,

    })
  ]
}

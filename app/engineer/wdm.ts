import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import { config } from './webpack.config';

export const wdm = () => {
  const devConfig = config({ mode: 'development' });
  const compiler = webpack(devConfig);
  const devMiddleWare = webpackDevMiddleware(compiler, {
    publicPath: devConfig.output?.publicPath
  });
  const hotMiddleWare = webpackHotMiddleware(compiler, {
    // path: './log/hotMiddleWareRecord',
    heartbeat: 1000 * 2
  })
  return [
    devMiddleWare,
    hotMiddleWare
  ]
}

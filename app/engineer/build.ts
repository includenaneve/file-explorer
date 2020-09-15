// 创建 compiler
// compiler.run {
//   处理异常
//   生成一个mainist文件，里面存放output的版本hash值
// }
// run结束也会根据webpack.config来生成出编译好的文件
import webpack from 'webpack';
import { config } from './webpack.config';
import fs from 'fs';
import { MANIFEST_PATH } from './path';

// interface StatuToJSONResponse {
//   errors: ToJsonOutput.errors;
//   assetsByChunkName: ToJsonOutput.assetsByChunkName;
// }

function build() {
  const prodConfig = config({ mode: 'production' });
  const compiler = webpack(prodConfig);
  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
    } else {
      /** Returns a formatted string of the compilation information (similar to CLI output). */
      // 这里是为了拿到assetsByChunkName: { app: 'app.[chuckhash:10].js' } 并且把这个写入到文件里面，方便服务器中间件做替换。
      const { errors, assetsByChunkName } = stats.toJson()
      if (errors) {
        for (let error of errors) {
          console.error(error);
        }
        process.exit(1);
      } else {
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(assetsByChunkName, null, 2), 'utf8');
      }
    }
  })
}

build();
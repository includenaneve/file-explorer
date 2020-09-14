// 负责构建
import fs from 'fs';
import webpack from 'webpack';
import { config } from './webpack.config';
import { MANIFEST_PATH } from './paths';

async function build() {
  const buildConfig = config({ mode: 'production' });
  const compiler = webpack(buildConfig);
  compiler.run(function(err, stats) {
    if (err) {
      console.error(err)
    } else {
      const { errors, assetsByChunkName = {} } = stats.toJson()
      if (stats.hasErrors()) {
        for (let error of errors) {
          console.error(error);
        }
        process.exit(1);
      }
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(assetsByChunkName, null, 2), 'utf8');
      for (let [assetName, assetFiles] of Object.entries(assetsByChunkName)) {
        console.log(assetName);
        console.log(assetFiles);
      }
    }
  })
}

build();
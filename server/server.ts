import fs, { createReadStream } from 'fs';
import path from 'path';
import express from 'express';
import pify from 'pify';
import { APP_INDEX_ROOT, MANIFEST_PATH } from '../app/engineer/path';
import { wdm } from './../app/engineer/wdm'
import { ENV } from './enviment'

const app = express();
const documentRoot = 'C:\\Code\\exp';
const IS_DEVELOPMENT = ENV === 'development';

// 处理静态资源请求（这里用作文件下载和图片预览中间件）
app.use('/static', express.static(documentRoot));

if (IS_DEVELOPMENT) {
  app.use(wdm());
} else {
  app.use('/assets', express.static(path.resolve(__dirname, '../app/dist')));
}

// 处理目录读取 （这里用作api中间件）
app.use('/file', async(req, res) => {
  // 访问 /file/document 相当于要访问根目录下的 /document
  const requestPath = req.path;
  const visitPath = path.join(documentRoot, requestPath.replace(/^\/file/, ''));
  try {
    const stats = await pify(fs.stat)(visitPath)
    if (stats.isDirectory()) {
      const { err, fileList } = await pify(fs.readdir)(visitPath)
      res.json({ code: 0, message: 'ok', data: { fileList } });
    } else {
      res.json({ code: 9001, message: 'Not a directory' });
    }
  } catch (err) {
    res.status(500).end(err.massage);
    return
  }
});

app.use('/sync', (req, res) => {
  const start = +new Date();
  while(+new Date() - start < 10000) {}
  res.send('finish');
});

app.use('/async', (req, res) => {
  setTimeout(() => res.send('finish'), 10000);
});

// 直出前端视图
app.use(async(req, res) => {
  // 拿到html文件
  // 拿到manifest里面的版本号
  // 替换html里面的js文件
  const manifest = await pify(fs.readFile)(MANIFEST_PATH, 'utf8');
  const { app } = JSON.parse(manifest);
  const html = await pify(fs.readFile)(APP_INDEX_ROOT, 'utf8');
  const modifyHTML = html.replace(/%APP_SCRIPT_FLAG%/, `/assets/${IS_DEVELOPMENT ? 'app.js' : app}`);
  res.status(200).send(modifyHTML);
});


app.listen(9527);
console.log('Server is listening in http://127.0.0.1:9527');


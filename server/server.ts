import fs from 'fs';
import path from 'path';
import express from 'express';
import pify from 'pify';
import manifest from './manifest.json';
import { ENV } from './config';
import { wdm } from '../app/engineering/wdm';

const documentRoot = 'C:\\Code\\exp';
const app = express();

// 处理静态资源请求（这里用作文件下载和图片预览中间件）
app.use('/static', express.static(documentRoot));

if (ENV === 'development') {
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
    res.status(500).end(err.massage)
    return
  }
});


// 直出前端视图
app.use(async (req, res) => {
  const htmlPath = path.resolve(__dirname, '../app/static/index.html');
  const html: string = await pify(fs.readFile)(htmlPath, 'utf8');
  const { app } = manifest
  const htmlRes = html.replace(/%APP_SCRIPT_URL%/, ENV === 'development' ? '/assets/app.js' : `/assets/${app}`);
  res.send(htmlRes);
});

app.listen(9527);
console.log('Server is listening in http://127.0.0.1:9527');


// app.use('/sync', (req, res) => {
//   const start = +new Date();
//   while(+new Date() - start < 10000) {}
//   res.send('finish');
// });

// app.use('/async', (req, res) => {
//   setTimeout(() => res.send('finish'), 10000);
// });
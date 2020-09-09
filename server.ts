import fs from 'fs';
import path, { extname } from 'path';
import http from 'http';
import express from 'express';
import serveIndex from 'serve-index';

const documentRoot = 'C:\\Code\\exp';

const app = express();

// 处理静态资源请求
app.use('/static', express.static(documentRoot));

// 处理目录读取
app.use('/file', (req, res) => {
  // 访问 /file/document 相当于要访问根目录下的 /document
  const requestPath = req.path;
  const visitPath = path.join(documentRoot, requestPath.replace(/^\/file/, ''));

  // TODO: 使用 async await + pify 的形式来实现
  fs.stat(visitPath, (err, stats) => {
    if (err) {
      res.statusCode = 500;
      res.end(err.message);
      return;
    }
    if (stats.isDirectory()) {
      fs.readdir(visitPath, (err, fileList) => {
        if (err) {
          res.statusCode = 500;
          res.end(err.message);
          return;
        }
        res.json({ code: 0, message: 'ok', data: { fileList } });
      });
    }
    else {
      res.json({ code: 9001, message: 'Not a directory' });
    }
  });
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
app.use((req, res) => {
  res.send('It works');
});


app.listen(9527);
console.log('Server is listening in http://127.0.0.1:9527');


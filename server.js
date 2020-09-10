const fs = require('fs');
const path = require('path');
const documentRoot = 'C:\\Code\\exp';
const express = require('express');
const pify = require('pify');
const app = express();

// 处理静态资源请求
app.use('/static', express.static(documentRoot));

// 处理目录读取
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
  res.send('It works!!!');
});


app.listen(9527);
console.log('Server is listening in http://127.0.0.1:9527');


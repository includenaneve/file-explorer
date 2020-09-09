import fs from 'fs';
import path, { extname } from 'path';
import http from 'http';
import express from 'express';
import serveIndex from 'serve-index';

const documentRoot = 'C:\\Code\\exp';

const app = express();

app.use('/static', express.static(documentRoot));
app.use('/static', serveIndex(documentRoot));

app.use('/file', (req, res) => {
  // 访问 /file/document 相当于要访问根目录下的 /document
  const requestPath = req.path;
  const visitPath = path.join(documentRoot, requestPath.replace(/^\/file/, ''));

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
      const extName = path.extname(visitPath);
      if (['.gif', '.jpg', '.png'].find(x => extName.toLowerCase() === x)) {
        res.setHeader('Content-Type', 'image/' + extName.slice(1));
      }
      else {
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(path.basename(visitPath))}"`);
      }
      res.statusCode = 200;
      fs.createReadStream(visitPath).pipe(res);
    }
  });
});

app.use((req, res) => {
  res.send('It works');
});

app.listen(9527);
console.log('Server is listening in http://127.0.0.1:9527');


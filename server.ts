import fs from 'fs';
import path, { extname } from 'path';
import http from 'http';
import url from 'url';

const documentRoot = 'C:\\Code\\exp';

const server = http.createServer((req, res) => {

  const visitPath = path.join(documentRoot, decodeURI(req.url || ''));

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
        res.setHeader('Content-Type', 'text/html; charset=utf8');
        res.write(`<!DOCTYPE html>
          <html>
            <body>
              <p>${req.url} 有 ${fileList.length} 个文件</p>
              <ul>
                <li><a href="..">..</a></li>
                ${fileList.map(x => `<li><a href="${path.join(req.url || '/', x)}">${x}</a></li>`).join('\r\n')}
              </ul>
            </body>
          </html>
        `);
        res.end();
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

server.listen(9527);
console.log('Server is listening in http://127.0.0.1:9527');
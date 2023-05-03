const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');



const querystring = require('querystring');
const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./models/jobs');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected!');
}).catch((err) => {
  console.error(err);
});

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST, GET');
  res.setHeader('Access-Control-Max-Age', 2592000); 

  const reqUrl = url.parse(req.url);
  const reqPath = reqUrl.pathname;


  console.log(req.url);

  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
      if (err) throw err;
      res.writeHead(200, { 'Content-type': 'text/html' });
      res.end(content);
    });
  } else if (req.url === '/style.css') {
    fs.readFile(path.join(__dirname, 'public', 'style.css'), (err, content) => {
      if (err) throw err;
      res.writeHead(200, { 'Content-type': 'text/css' });
      res.end(content);
    });
  } else if (req.url.startsWith('/images/')) {
    const imagePath = path.join(__dirname, 'public', req.url);
    const imageExt = path.extname(imagePath);

    fs.readFile(imagePath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(200, { 'Content-type': `image/${imageExt.substring(1)}` });
        res.end(content);
      }
    });
 
  } else if (req.method === 'GET' && reqPath === '/api/jobs') {
    Job.find()
      .then((jobs) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        
        res.end(JSON.stringify(jobs));
      })
      .catch((err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
      });
  } 
  else {
    // Serve all other HTML files in the public folder
    const filePath = path.join(__dirname, 'public', reqPath === '/' ? 'index.html' : reqPath);
    const fileExt = path.extname(filePath);

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(200, { 'Content-type': `text/${fileExt.substring(1)}` });
        res.end(content);
      }
    });
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server running on http://localhost:${port}`));

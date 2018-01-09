const http = require('http');
const WebApp = require('./webapp');
const fs = require('fs');
const url = require('url');
const PORT = 9999;
let names = [];
let name = '';

const getExtension = function(fileName) {
  let extension = fileName.slice(fileName.lastIndexOf('.'));
  return extension;
}

const getContentType = function(extension) {
  let contentType = {
    ".html": "text/html",
    ".css": "text/css",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpg",
    ".pdf": "application/pdf",
    ".gif": "image/gif"
  }
  return contentType[extension];
}

const doesFileExists = function(fileName) {
  return fs.existsSync(fileName);
}

const updateGivenUrl = function(url) {
  if (url == '/') {
    return './public/index.html';
  }
  return `./public${url}`;
};

const requestHandler = function(req, res) {
  console.log(req.method);
  if (req.url.startsWith('/guestBook.html?')){
    let url = req.url;
    names.unshift(getCommentWithDetails(url));
    name = '';
    let newUrl = getPathname(url);
    if (newUrl == '/guestBook.html') {
      res.write(fs.readFileSync('./public/guestBook.html'))
      let list = names.map(function(name) {
        return `<li>${name}`;
      });
      res.write(list.join(''));
      return;
    }
  }
  let updatedUrl = updateGivenUrl(req.url);
  if (doesFileExists(updatedUrl)) {
    let extension = getExtension(updatedUrl);
    let contentType = getContentType(extension);
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.write(fs.readFileSync(updatedUrl));
  } else {
    res.statusCode = 404;
    res.write(`Error:404 File Not Found`);
  }
  res.end();
  return;
}

const getPathname = function(req){
  let details = url.parse(req);
  return details.pathname;
};

const getDateAndTime = function(){
  let date = new Date();
  return date.toDateString() + '  ' + date.toLocaleTimeString();
};

const getNameAndComment = function(req){
  let str = url.parse(req);
  str = str.query;
  let commentor = str.split('&')[0].split('=')[1];
  let comment = str.split('&')[1].split('=')[1];
  return 'Name: ' + commentor + '__' + 'Comment: ' + comment;
};

let getCommentWithDetails = function(url) {
  let nameAndComment = getNameAndComment(url);
  let dateAndTime = getDateAndTime();
  return dateAndTime + '__' + nameAndComment;
};

const server = http.createServer(requestHandler);
server.listen(PORT);
console.log(`Listening at ${PORT}`);
console.log("Homepage URL http://localhost:9099/index.html");

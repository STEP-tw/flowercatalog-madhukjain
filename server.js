let fs = require('fs');
const http = require('http');
const WebApp = require('./webapp');
const timeStamp = require('./time.js').timeStamp;
let toS = o => JSON.stringify(o,null,2);
const PORT = 9099;
let registered_users =
  [{userName:'madhurk',name:'Madhuri Kondekar'},
  {userName:'aditiL',name:'Aditi Lahare'}];

let logRequest = (req,res) => {
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} =====>${req.url}`);
};

let loadUser = (req,res) => {
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

let redirectLoggedInUserToHome = (req,res) => {
  if(req.urlIsOneOf(['/','/login']) && req.user) res.redirect('/home');
};

let redirectLoggedOutUserToLogin = (req,res) => {
  if(req.urlIsOneOf(['/','/home','/logout']) && !req.user) res.redirect('/login');
};

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);

app.get('/',(req,res) => {
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync('./public/index.html'));
  res.end();
});

app.get('/index.html',(req,res) => {
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync('./public/index.html'));
  res.end();
});

app.get('/ageratum.html',(req,res) => {
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync('./public/ageratum.html'));
  res.end();
});

app.get('/abeliophyllum.html',(req,res) => {
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync('./public/abeliophyllum.html'));
  res.end();
});

app.get('/guestBook.html',(req,res) => {
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync('./public' + req.url));
  res.end();
});

app.get('/css/index.css',(req,res) => {
  res.setHeader('Content-type','text/css');
  res.write(fs.readFileSync('./public' + req.url));
  res.end();
});

app.get('/css/ageratum.css',(req,res) => {
  res.setHeader('Content-type','text/css');
  res.write(fs.readFileSync('./public' + req.url));
  res.end();
});

app.get('/css/abeliophyllum.css',(req,res) => {
  res.setHeader('Content-type','text/css');
  res.write(fs.readFileSync('./public' + req.url));
  res.end();
});

app.get('/css/guestBook.css',(req,res) => {
  res.setHeader('Content-type','text/css');
  res.write(fs.readFileSync('./public/css/guestBook.css'));
  res.end();
});

app.get('/img/abeliophyllum.jpg',(req,res) => {
  res.setHeader('Content-type',"image/jpg");
  res.write(fs.readFileSync('./public' + req.url));
  res.end();
});

app.get('/img/ageratum.jpg',(req,res) => {
  res.setHeader('Content-type',"image/jpg");
  res.write(fs.readFileSync('./public' + req.url));
  res.end();
});

app.get('/img/freshorigins.jpg',(req,res) => {
  res.setHeader('Content-type',"image/jpg");
  res.write(fs.readFileSync('./public' + req.url));
  res.end();
});

app.get('/img/wateringJar.gif',(req,res) => {
  res.setHeader('Content-type',"image/gif");
  res.write(fs.readFileSync('./public' + req.url));
  res.end();
});

app.get('/docs/abeliophyllum.pdf',(req,res) => {
  res.setHeader('Content-type',"application/pdf");
  res.write(fs.readFileSync('./public' + req.url));
  res.end();
});

app.get('/docs/ageratum.pdf',(req,res) => {
  res.setHeader('Content-type',"application/pdf");
  res.write(fs.readFileSync('./public' + req.url));
  res.end();
});



let server = http.createServer(app);
server.on('error',e => console.error('**error**',e.message));
server.listen(PORT,(e) => console.log(`server listening at ${PORT}`));

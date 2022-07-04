const express = require('express');
const app = express();
const helmet = require('helmet');

//Express sends "powered by Express/Node" on every request coming from Express by default, but we hide that so a hacker won't use vulnerabilities known for Express
app.use(helmet.hidePoweredBy());

//Preventing clickjacking attacks where our page would be put in a <frame> or <iframe> 
app.use(helmet.frameguard({
  action: 'deny'
}))

//To sanitize input to prevent (basic) XSS
app.use(helmet.xssFilter())

//Browser sometimes use content of MIME sniffing to override response "Content-Type" which might be convenient but it's dangerous therefore we set nosniff so the browser won't bypass "Content-Type"
app.use(helmet.noSniff())

//Some browsers serve untrusted HTML for download, restrict an untrusted HTML page from executing maliciously in the context of our pages
app.use(helmet.ieNoOpen())

//If our website supports HTTPS then weshould force the browser to use HTTPS through HSTS to avoid downgrade attacks
timeInSec=7776000;
app.use(helmet.hsts({
  maxAge: timeInSec, force: true
}))

//If we're managing a large website with huge security needs then we can disable DNS prefetch
app.use(helmet.dnsPrefetchControl())

//If we want the user to always downlaod the newer version of the website then we can disable cache, only do this in rare scenarios
app.use(helmet.noCache())

//Specify a Content Security Policy which in modern browsers it filters throughout many common vulnerabilities like XSS, tracking, malicious freames...
app.use(helmet.contentSecurityPolicy({
  directives:{
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'trusted-cdn.com']
  }
}))
//app.use(helmet()) will automatically include all the middleware introduced above, except noCache(), and contentSecurityPolicy()
/*Example:app.use(helmet({
  frameguard: {         // configure
    action: 'deny'
  },
  contentSecurityPolicy: {    // enable and configure
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ['style.com'],
    }
  },
  dnsPrefetchControl: false     // disable
}))
*/










































module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});

var http = require('http')
  , url = require('url')
  , qs = require('querystring')
  , github = require('octonode');

var port = process.env.port || 3000;

var auth_url = github.auth.config({
  id: 'bca45fd2f43f26aea419',
  secret: '9c53ac567810807e198fedae06e5197499edb7bf'
}).login(['user', 'repo', 'gist']);

var mytoken = "";

// Store info to verify against CSRF
var state = auth_url.match(/&state=([0-9a-z]{32})/i);

// Web server
http.createServer(function (req, res) {
  var uri = url.parse(req.url);
  // Redirect to github login
  if (uri.pathname=='/login') {
    res.writeHead(302, {'Content-Type': 'text/plain', 'Location': auth_url})
    res.end('Redirecting to ' + auth_url);
  }
  // Callback url from github login
  else if (uri.pathname=='/auth') {
    var values = qs.parse(uri.query);
    // Check against CSRF attacks
    if (!state || state[1] != values.state) {
      res.writeHead(403, {'Content-Type': 'text/plain'});
      res.end('');
    } else {
      github.auth.login(values.code, function (err, token) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(token);
        mytoken = token;
        var client = github.client(mytoken);
        var ghrepo         = client.repo('jaaromy/pipeline');
        console.log(ghrepo);
      });
    }
  } else {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('');
  }
}).listen(3000);

console.log('Server started on 3000');
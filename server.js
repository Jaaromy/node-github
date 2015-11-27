var http = require('http');
var port = process.env.port || 3001;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Router? I hardly know her!\n');
}).listen(port);
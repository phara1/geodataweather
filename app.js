let http = require('http');
let url = require('url');

const routers = require('./js/routers.js');
const utils = require ('./js/utils.js');
const port = '8080';

http.createServer(function (req, res) {
    const pathName = url.parse(req.url, true).pathname;
    if (pathName == '/favicon.ico')
        return;

    routers.handleRequest(pathName, req, res);

}).listen(port);


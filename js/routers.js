const utils = require('./utils.js');

function handleRequest(pathName, req, res) {
    switch(pathName) {
        case '/':
            utils.readFileWithGeneral('./html/index.html', res, 'text/html');
            break;
        case '/spammer':
            utils.readFileWithGeneral('./html/spammer.html', res, 'text/html');
            break;
        case '/style.css':
            utils.readFile('./assets/style.css', res, 'text/css');
            break;
        case '/spammer.js':
            utils.readFile('./js/spammer.js', res, 'text/js');
            break;
        case '/weather.js':
            utils.readFile('./js/weather.js', res, 'text/js');
            break;
        case '/header.js':
                utils.readFile('./js/header.js', res, 'text/js');
                break;
        case '/forecastMap':
            pathName = './data.json';
            utils.readFile(pathName, res, 'text/json');
            utils.forecastMapper(pathName, req, res);
            utils.clearFileContent(pathName, req, res);
            break;
        case '/weathermap':
            utils.readFileWithGeneral('./html/weather.html', res, 'text/html');
            break;
        default:
            utils.readFile('./html/404.html', res, 'text/html');
            break;
    }
}

module.exports = {
    handleRequest
}
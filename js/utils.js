const fsPromises = require('fs/promises');
let fs = require('fs');

const fileChecker = async (filename, text) => {
    try {

        const contents = await fsPromises.readFile(filename, 'utf-8');


        if (contents.includes(text)) {

            const updatedContents = contents.replace(text, '');


            await fsPromises.writeFile(filename, updatedContents, 'utf-8');
            console.log('Text removed from the file.');
            return true;
        }
    } catch (err) {
        console.error('Error reading or writing the file:', err);
    }

    return false; // Return false if no modification was made
}

function clearFileContent(filePath, req, res) {
    let method = req.method;
    if (method === 'DELETE') {
        fs.writeFile(filePath, '', (err) => {
            if (err) {
                console.error('Error clearing file content:', err);
            } else {
                console.log('File content cleared successfully.');
            }
        });
    }
}

function writeFile(filePath, geoDataLib) {
    fs.writeFile(filePath, JSON.stringify(geoDataLib, null, 3), { flag: 'a+' }, err => {
        if (err) {
            console.error(err);
        } else {
            console.log('File written successfully');
        }
        fileChecker(filePath, '[]');
        fileChecker(filePath, '][');
    });
}

function readFileWithGeneral(filePath, res, textType) {
    fs.readFile('./html/general.html', 'utf8', (err, dataGeneral) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                const GENERAL = dataGeneral.replace('<!-- PAGE INCLUDER -->', data);
                res.statusCode = 200;
                res.writeHead(200, { 'Content-Type': textType });
                res.end(GENERAL, 'utf8');
            });
    });
}

function readFile(filePath, res, textType) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        res.statusCode = 200;
        res.writeHead(200, { 'Content-Type': textType });
        res.end(data, 'utf8');
    });
}


function forecastMapper(filePath, req, res) {
    let geoDataLib;
    method = req.method;
    if (method === 'POST') {

        let body = '';
        // Collect data chunks
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                geoDataLib = JSON.parse(body);
                writeFile(filePath, geoDataLib);
                fileChecker(filePath, '[]');
                fileChecker(filePath, '][');
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.write(JSON.stringify({ message: 'Invalid JSON' }));
            }
        });
    }
}
module.exports = {
    fileChecker,
    clearFileContent,
    writeFile,
    readFile,
    forecastMapper,
    readFileWithGeneral
};
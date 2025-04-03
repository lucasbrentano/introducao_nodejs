import http from 'http'
import fs from 'fs'
import routes from './routes.js'

fs.writeFile('./message.txt', "Hello, from the file!", 'utf8', (error) => {
    if(error) {
        console.log("Error writing to the file!", error);
        return;
    }
    console.log("File successfully created!");
});

fs.readFile('./message.txt', 'utf8', (error, content) => {
    if(error) {
        console.log("Error reading the file!")
        return;
    }

    console.log(`Content: ${content}`);

    startHttpServer(content);
});

function startHttpServer(content) {
    const server = http.createServer((req, res) => {
        routes(req, res, {content});
    });

    const port = 3000;
    const host = 'localhost';

    server.listen(port, host, () => {
        console.log(`Server start in http://${host}:${port}/`);
    });
}

function traditional() {
    console.log('Traditional');
};

const expression = function() {
    console.log('Expression');
};

const arrow = () => {
    console.log('Arrow');
};
// Without using a framework, build a web server to render html files:
// When I navigate to “/index.html”, I should see a simple webpage of the student. (Nothing fancy)

const http = require('http');
const fs = require('fs');
const path = require('path');

const localHost = 'localhost';
const port = 3000;

const server = http.createServer((req,res)=>{
    if(req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data)=>{
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    }
    else {

        // res.end('404 not found');
        fs.readFile(path.join(__dirname, 'error.html'), (err, data)=>{
            if(err) throw err;
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })

    }
})

server.listen(port, localHost, ()=>{
    console.log(`Server is running on http://${localHost}:${port}`);
})



const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const herokuUrl = JSON.stringify(process.env);

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT } at heroku ${herokuUrl}`));

const wss = new SocketServer({ server });

console.log('Server Running ', wss.address());

wss.on('connection', function connection(ws, req) {
    const ip = req.connection.remoteAddress;
    console.log(`Connected from ip ${ip}`);
    
    ws.on('message', (message) => {
        var index = 0;
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
                client.send(message);
                index++;
                console.log(`Message received and broadcasted to  ${index}`)
            }
        });
    });
    
});
setInterval(() => {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({ tic: new Date().toTimeString().toString() }));
    });
}, 5000);

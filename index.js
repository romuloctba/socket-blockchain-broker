const WebSocket = require('ws');
const port = process.argv[2] || 8787;
const WS_URL = `ws://localhost:${port}`;

const wss = new WebSocket.Server({
    port
});

console.log('Server Running ', wss.address());

wss.on('connection', function connection(ws, req) {
    const ip = req.connection.remoteAddress;
    console.log(`Connected from ip ${ip}`);
    
    ws.on('message', function incoming(message) {
        message = JSON.parse(message);

        if (!message || !message.action || socketAPI[message.action] == undefined) {
            ws.send('{ "author": "${WS_URL}", "message": "INVALID_ACTION"}');
            return;      
        }
        
        const action = socketAPI[message.action];
        action(message, ws);
    });
});


const WebSocket = require('ws');
const port = process.argv[2] || process.env.PORT || 8787;
const WS_URL = `ws://0.0.0.0:${port}`;

const wss = new WebSocket.Server({
    port
});

console.log('Server Running ', wss.address());

wss.on('connection', function connection(ws, req) {
    const ip = req.connection.remoteAddress;
    console.log(`Connected from ip ${ip}`);
    
    ws.on('message', function incoming(message) {
        var index = 0;
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
                index++;
                console.log(`Message received and broadcasted to  ${index}`)
            }
        });
    });
});

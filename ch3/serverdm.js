var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server,
    wss = new WebSocketServer({
        port: 8181
    });

var clients = [];

function wsSend(type, message) {
    for (var i = 0; i < clients.length; i++) {
        var clientSocket = clients[i].ws;
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
                "type": type,
                "message": message
            }));
        }
    }
}
wss.on('connection', function(ws) {
    clients.push({
        "ws": ws
    });
    ws.on('message', function(message) {
        wsSend("message", message);
        console.log("1:" + message);
    });
    process.on('SIGINT', function() {
        console.log("Closing things");
        process.exit();
    });
});
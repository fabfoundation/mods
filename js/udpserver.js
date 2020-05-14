//
// udpserver.js
//    WebSocket UDP server
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2016
// modified by Francisco Sanchez Arroyo 14-Feb-2020
//
// This work may be reproduced, modified, distributed, performed, and
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is
// provided as is; no warranty is provided, and users accept all
// liability.
//
// check command line
//
if (process.argv.length < 4) {
    console.log("command line: node udpserver.js client_address server_port")
    process.exit(-1)
}
//
// get address(es)
//
var os = require('os')
var interfaces = os.networkInterfaces()
var addresses = []
for (var i in interfaces) {
    for (var j in interfaces[i]) {
        var address = interfaces[i][j]
        if (address.family === 'IPv4')
            addresses.push(address.address)
    }
}
//
// start server
//
var dgram = require("dgram")
var client_address = process.argv[2]
var server_port = process.argv[3]
console.log("udpserver listening for connection from client address " + client_address + " on server port " + server_port)
var WebSocketServer = require('ws').Server
wss = new WebSocketServer({
    port: server_port
})
//
// handle connection
//
wss.on('connection', function(ws) {
    //
    // check address
    //
    if (ws._socket.remoteAddress != client_address) {
        console.log("connection rejected from " + ws._socket.remoteAddress)
        ws.send('socket closed')
        ws.close()
    } else {
        console.log("connection accepted from " + ws._socket.remoteAddress)
    }
    //
    // handle messages
    //
    var server = null
    ws.on("message", function(message) {
        var msg = JSON.parse(message)
        //
        // open local server
        //
        if (msg.type == 'open local') {
            var port = parseInt(msg.port)
            server = dgram.createSocket("udp4")
            server.bind(port)
            server.on('listening', function() {
                console.log("server listening on port " + port)
                msg = {}
                msg.type = 'listening'
                msg.addresses = addresses
                msg.status = 'listening on ' + port
                ws.send(JSON.stringify(msg))
            })
            server.on("message", function(message, info) {
                var msg = {}
                msg.type = 'message'
                msg.message = message.toString('utf8')
                msg.info = info
                ws.send(JSON.stringify(msg))
            })
            server.on("error", function(err) {
                msg = {}
                msg.type = 'status'
                msg.status = 'error: ' + JSON.stringify(err)
                ws.send(JSON.stringify(msg))
            })
        }
        //
        // send string
        //
        else if (msg.type = 'send string') {
            var client = dgram.createSocket("udp4")
            client.send(msg.string.toString(), 0, msg.string.length, msg.port, msg.host,
                function(err) {
                    client.close()
                    msg = {}
                    msg.type = 'status'
                    msg.status = 'transmit (' + JSON.stringify(err) + ')'
                    ws.send(JSON.stringify(msg))
                }
            )
        }
    })
    //
    // close
    //
    ws.on("close", function() {
        console.log("connection closed")
        if (server != null)
            server.close()
        server = null
    })
})

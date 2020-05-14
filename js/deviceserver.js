//
// deviceserver.js
//    WebSocket device server
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2019
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
    console.log("command line: node deviceserver.js client_address server_port")
    process.exit(-1)
}
//
// start server
//
var client_address = process.argv[2]
var server_port = process.argv[3]
console.log("deviceserver listening for connection from client address " + client_address + " on server port " + server_port)
var fs = require("fs")
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
    var cancel
    ws.on("message", function(msg) {
        //
        // cancel job
        //
        if (msg == 'cancel') {
            cancel = true
        }
        //
        // start job
        //
        else {
            var job = JSON.parse(msg)
            if (job == undefined) {
                console.log('no job to send')
                ws.send('no job to send')
            } else {
                var count = 0
                var file
                console.log('writing ' + job.name + ' (length ' + job.contents.length + ') to ' + job.device)
                cancel = false
                fs.open(job.device, 'w', function(err, fd) {
                    if (err) {
                        console.log('error: ' + err)
                        ws.send('error: ' + err)
                    } else {
                        file = fd
                        write_char()
                    }
                })
                //
                // character writer
                //
                function write_char() {
                    //
                    // cancel
                    //
                    if (cancel) {
                        console.log('cancel')
                        ws.send('cancel')
                        fs.close(file)
                    }
                    //
                    // continue
                    //
                    else {
                        fs.write(file, job.contents, function(err, written, string) {
                            if (err) {
                                console.log('error ' + err)
                                ws.send('error ' + err)
                            } else {
                                console.log('done')
                                ws.send('done')
                                fs.close(file, function(err) {
                                    if (err) {
                                        console.log('error: ' + err)
                                        ws.send('error: ' + err)
                                    }
                                })

                            }
                        })
                    }
                } // end of write_char
            } //end of else
        } // end of else
    })
    //
    // close
    //
    ws.on("close", function() {
        console.log("connection closed")
    })
})

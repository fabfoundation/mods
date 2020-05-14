//
// printserver.js
//    WebSocket print server
//
// dependencies:
//    npm i printer ws
//    Windows
//       npm install --global windows-build-tools
//    Linux
//       sudo apt-get install node-gyp
//       sudo apt-get install libcups2-dev
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2017
// Modified by Francisco Sanchez Arroyo 14-Feb-2020
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is no warranty is provided, and users accept all 
// liability.
//
// check command line
//
if (process.argv.length < 4) {
    console.log("command line: node printserver.js client_address server_port")
    process.exit(-1)
}
//
// start server
//
var client_address = process.argv[2]
var server_port = process.argv[3]
console.log("printserver listening for connection from client address " + client_address + " on server port " + server_port)
//
// requires
//
var printer = require("printer")
var WebSocketServer = require('ws').Server
//
// start WebSocket server
//
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
    if (!ws._socket.remoteAddress) {
        console.log("connection rejected from " + ws._socket.remoteAddress)
        ws.send('socket closed')
        ws.close()
    } else {
        console.log("connection accepted from " + ws._socket.remoteAddress)
        // get printer list
        function getPrinterList() {
            var printerList = []
            var printers = printer.getPrinters()
            if (printers && printers.length) {
                var i = printers.length
                for (i in printers) {
                    var pr = printers[i]
                    printerList.push(pr.name)
                }
            }
            var printerListObj = {}
            printerListObj['printerList'] = printerList
            printerListObj['default'] = printer.getDefaultPrinterName()
            return printerListObj
        }

        ws.send(JSON.stringify(getPrinterList()))
        ws.send('socket opened')
    }
    //
    // handle messages
    //
    var cancel
    var pagesPrinted
    ws.on("message", function(msg) {
        console.log(msg)
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
            console.log('writing ' + job.name + ' (length ' + job.contents.length + ') to printer ' + job.printer)
            cancel = false
            print()
            //
            // print all
            //
            function print() {
                console.log(job.contents)
                printer.printDirect({
                    data: job.contents,
                    type: 'RAW',
                    printer: job.printer,
                    success: function(jobID) {
                        console.log("sent to printer with ID: " + jobID)
                        check_process()
                        //
                        // Check process
                        //
                        function check_process() {
                            var jobInfo
                            try {
                                jobInfo = printer.getJob(job.printer, jobID)
                            } catch (err) {
                                ws.send('done')
                                return
                            }
                            console.log("current job info:" +
                                JSON.stringify(jobInfo))
                            if (jobInfo.status.indexOf('PRINTED') !== -1) {

                                var ret = printer.setJob(job.printer,
                                    jobID, 'CANCEL')

                                ws.send('done')
                                return
                            }
                            //
                            // cancel
                            //
                            if (cancel) {
                                console.log('cancelling...')
                                ws.send('cancel')
                                var ret = printer.setJob(job.printer,
                                    jobID, 'CANCEL')
                                console.log("cancelled: " + ret)
                            }
                            //
                            // continue
                            //
                            else {
                                ws.send(jobInfo.status[0])
                                setTimeout(check_process, 1000)
                            }
                        }
                    },
                    error: function(err) {
                        console.log(err)
                        ws.send('error ' + err)
                    }
                })
            }
        }
    })
    //
    // close
    //
    ws.on("close", function() {
        console.log("connection closed")
    })
})

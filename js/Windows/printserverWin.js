//
// printserver.js
//    WebSocket print server
//
// dependencies:
//    npm install serialport ws@1
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016,7
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
console.log("listening for connection from client address "+client_address+" on server port "+server_port)

var printer = require("printer")
var util = require('util')
var WebSocketServer = require('ws').Server
wss = new WebSocketServer({port:server_port})
//
// handle connection
//
wss.on('connection',function(ws) {
   //
   // check address
   //
   if (!ws._socket.remoteAddress) {
      console.log("connection rejected from "+ws._socket.remoteAddress)
      ws.send('socket closed')
      ws.close()
      }
   else {
      console.log("connection accepted from "+ws._socket.remoteAddress)
      }
   //
   // handle messages
   //
   var cancel
   var pagesPrinted
   ws.on("message",function(msg) {
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
         pagesPrinted = 0
         var printerName = printer.getDefaultPrinterName()
         var job = JSON.parse(msg)
         console.log('writing ' + job.name + ' (length ' + job.contents.length + ') to printer ' + printerName)
         console.log(job.contents)
         cancel = false
         print()
         //
         // print all
         //
         function print() {
            printer.printDirect({data:job.contents
	            //, printer:'Roland GS-24' // printer name, if missing then will print to default printer
                //, printer: job.device
	            , type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
	            , success: function (jobID) {
	                console.log("sent to printer with ID: " + jobID)
	                check_process()
	                //
	                // Check process
	                //
	                function check_process() {
	                    var jobInfo
		                try {
		                    jobInfo = printer.getJob(printerName, jobID)
		                } catch (err) {
		                    ws.send('done')
		                    return
		                }

		                pagesPrinted = jobInfo.pagesPrinted
		                console.log("current job info:" + util.inspect(jobInfo, { depth: 10, colors: true }))
		                if (jobInfo.status.indexOf('PRINTED') !== -1) {
		                    ws.send('done')
		                    return
		                }

		                //
		                // cancel
		                //
		                if (cancel) {
		                    console.log('cancelling...')
		                    ws.send('cancel')
		                    var is_ok = printer.setJob(printerName, jobID, 'CANCEL')
		                    console.log("cancelled: " + is_ok)
		                }
		                    //
		                    // continue
		                    //
		                else {
		                    ws.send(jobInfo.status[0])
		                    setTimeout(check_process, 1000)
		                }
		            }
	            }
	            , error:function(err){
                    console.log(err)
                    ws.send('error '+err+' 0 '+ 0)
                  }
            })

         }
       }
    })
   //
   // close
   //
   ws.on("close",function() {
      console.log("connection closed")
      })
   })
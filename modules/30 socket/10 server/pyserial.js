//
// Python serial server module
//
// Neil Gershenfeld 
// 1/17/20
// modified by Francisco Sanchez Arroyo 12-Feb-2020
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
// closure
//
(function() {
    //
    // module globals
    //
    var mod = {}
    //
    // name
    //
    var name = 'WebSocket pyserial'
    //
    // initialization
    //
    var init = function() {
        mod.address.value = '127.0.0.1'
        mod.port.value = '1239'
        mod.device.value = 'Serialport not found'
        mod.baud.value = '9600'
        mod.flow_dsrdtr.checked = true
        mod.socket = null
        socket_open()
    }
    //
    // inputs
    //
    var inputs = {
        transmit: {
            type: 'string',
            event: function(evt) {
                serial_send_string(evt.detail)
            }
        },
        file: {
            type: 'object',
            event: function(evt) {
                if (evt.detail.type == 'command') {
                    mod.command = evt.detail
                    socket_send(JSON.stringify(mod.command))
                } else if (evt.detail.type == 'file') {
                    mod.job = evt.detail
                    mod.job.type = 'file'
                    mod.label.nodeValue = 'send file'
                    mod.labelspan.style.fontWeight = 'bold'
                }
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        receive: {
            type: 'character',
            event: function(str) {
                mods.output(mod, 'receive', str)
            }
        }
    }
    //

    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // server
        //
        var a = document.createElement('a')
        a.href = './py/serialserver.py'
        a.innerHTML = 'serialserver.py:'
        a.target = '_blank'
        div.appendChild(a)
        div.appendChild(document.createElement('br'))
        //
        // status
        //
        var input = document.createElement('input')
        input.classList.add("marquee")
        input.disabled = true
        input.type = 'text'
        input.size = 19
        div.appendChild(input)
        mod.status = input
        div.appendChild(document.createElement('br'))

        //
        // address
        //
        div.appendChild(document.createTextNode('address: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.address = input
        div.appendChild(document.createElement('br'))
        //
        // port
        //
        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0port: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.port = input
        div.appendChild(document.createElement('br'))
        //
        // open/close
        //
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('open socket'))
        btn.addEventListener('click', function() {
            socket_open()
        })
        div.appendChild(btn)
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('close socket'))
        btn.addEventListener('click', function() {
            socket_close()
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('hr'))
        //
        // serial
        //
        div.appendChild(document.createTextNode('serial device:'))
        div.appendChild(document.createElement('br'))

        //
        // device
        //


        var select = document.createElement('select')

        var el = document.createElement('option')

        el.textContent = 'Serialport not found'
        el.value = 'Serialport not found'
        select.appendChild(el)
        div.appendChild(select)
        mod.device = select

        div.appendChild(document.createElement('br'))

        //
        // baud rate
        //
        div.appendChild(document.createTextNode('baud rate: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 7
        div.appendChild(input)
        mod.baud = input
        div.appendChild(document.createTextNode(' (bps)'))
        div.appendChild(document.createElement('br'))
        //
        // flow control
        //
        div.appendChild(document.createTextNode('flow control:'))
        div.appendChild(document.createElement('br'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'flow'
        input.id = mod.div.id + 'flow_none'
        div.appendChild(input)
        mod.flow_none = input
        div.appendChild(document.createTextNode('none\u00A0\u00A0\u00A0'))
        div.appendChild(document.createElement('br'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'flow'
        input.id = mod.div.id + 'flow_xonxoff'
        div.appendChild(input)
        mod.flow_xonxoff = input
        div.appendChild(document.createTextNode('XONXOFF'))
        div.appendChild(document.createElement('br'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'flow'
        input.id = mod.div.id + 'flow_rtscts'
        div.appendChild(input)
        mod.flow_rtscts = input
        div.appendChild(document.createTextNode('RTSCTS\u00A0'))
        div.appendChild(document.createElement('br'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'flow'
        input.id = mod.div.id + 'flow_dsrdtr'
        div.appendChild(input)
        mod.flow_dsrdtr = input
        div.appendChild(document.createTextNode('DSRDTR\u00A0'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createElement('br'))
        //
        // open/close
        //
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('open port'))
        btn.addEventListener('click', function() {
            serial_open()
        })
        div.appendChild(btn)
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('close port'))
        btn.addEventListener('click', function() {
            serial_close()
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('hr'))
        //
        // file button
        //
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('waiting for file')
        mod.label = text
        span.appendChild(text)
        mod.labelspan = span
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            if (mod.socket == null) {
                mod.status.value = "can't send, not open"
            } else if (mod.label.nodeValue == 'send file') {
                socket_send(JSON.stringify(mod.job))
                mod.label.nodeValue = 'cancel'
            } else if (mod.label.nodeValue == 'cancel') {
                mod.command = {}
                mod.command.type = 'cancel'
                socket_send(JSON.stringify(mod.command))
            }
        })
        div.appendChild(btn)
    }
    //
    // local functions
    //
    function socket_open() {
        var url = "ws://" + mod.address.value + ':' + mod.port.value
        mod.socket = new WebSocket(url)
        mod.socket.onopen = function(event) {
            mod.status.value = "socket opened"
        }
        mod.socket.onerror = function(event) {
            mod.status.value = "can not open"
            mod.socket = null
        }
        mod.socket.onmessage = function(event) {
            mod.status.value = event.data
            outputs.receive.event(event.data)
            if ((event.data == 'done') || (event.data == 'cancel') || (event.data.slice(0, 5) == 'error')) {
                mod.label.nodeValue = 'waiting for file'
                mod.labelspan.style.fontWeight = 'normal'
            }
            //
            // port list
            //
            else if (event.data[0] === '{') { // If receiving an object
                console.log('received object')
                var portObject = JSON.parse(event.data) // get the object
                var portList = portObject['portList'] // extract the list
                if (portList) {
                    while (mod.device.hasChildNodes()) {
                        mod.device.removeChild(mod.device.lastChild); //remove all previous options
                    }

                    for (var i = 0; i < portList.length; i++) {
                        var port = portList[i];
                        var el = document.createElement('option')
                        el.textContent = port
                        el.value = port
                        mod.device.appendChild(el)
                    }

                    if (portList.length == 0) {
                        var el = document.createElement('option')
                        el.textContent = 'Serialport not found'
                        el.value = 'Serialport not found'
                        mod.device.appendChild(el)
                    }

                }
            }





        }
    }





    function socket_close() {
        mod.socket.close()
        mod.status.value = "socket closed"
        mod.socket = null
    }

    function socket_send(msg) {
        if (mod.socket != null) {
            mod.status.value = "send"
            mod.socket.send(msg)
        } else {
            mod.status.value = "can't send, not open"
        }
    }

    function serial_open() {
        if (mod.socket == null) {
            mod.status.value = "socket not open"
        } else {
            if (mod.device.value == "Serialport not found") {
                mod.status.value = "no serial devices found"
            } else {
                var msg = {}
                msg.type = 'open'
                msg.device = mod.device.value
                msg.baud = mod.baud.value
                if (mod.flow_none.checked)
                    msg.flow = 'none'
                else if (mod.flow_rtscts.checked)
                    msg.flow = 'rtscts'
                else if (mod.flow_xonxoff.checked)
                    msg.flow = 'xonxoff'
                else if (mod.flow_dsrdtr.checked)
                    msg.flow = 'dsrdtr'
                mod.socket.send(JSON.stringify(msg))
            }
        }
    }

    function serial_close() {
        if (mod.socket == null) {
            mod.status.value = "socket not open"
        } else {
            if (mod.device.value == "Serialport not found") {
                mod.status.value = "serial device not open"
            } else {

                var msg = {}
                msg.type = 'close'
                msg.device = mod.device.value
                mod.socket.send(JSON.stringify(msg))
            }
        }
    }

    function serial_send_string(str) {
        if (mod.socket == null) {
            mod.status.value = "socket not open"
        } else {
            var msg = {}
            msg.type = 'string'
            msg.string = str
            //msg.line_ending = mod.line_ending.value //future
            mod.socket.send(JSON.stringify(msg))
            mod.status.value = 'transmit'
        }
    }
    //
    // return values
    //
    return ({
        mod: mod,
        name: name,
        init: init,
        inputs: inputs,
        outputs: outputs,
        interface: interface
    })
}())

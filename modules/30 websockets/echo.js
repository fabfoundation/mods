//
// echo module
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
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
    var name = 'echo'
    //
    // initialization
    //
    var init = function() {
        mod.address.value = '127.0.0.1'
        mod.port.value = 1237
        socket_open()
    }
    //
    // inputs
    //
    var inputs = {
        message: {
            type: 'String',
            event: function(evt) {
                mod.msg.value = evt.detail
                socket_send(evt.detail)
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        message: {
            type: 'String',
            event: function(msg) {
                mods.output(mod, 'message', msg)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        div.appendChild(document.createTextNode('server:'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('address: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.address = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0port: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.port = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('\u00a0\u00a0status: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.status = input
        div.appendChild(document.createElement('br'))
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('open'))
        btn.addEventListener('click', function() {
            socket_open()
        })
        div.appendChild(btn)
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('close'))
        btn.addEventListener('click', function() {
            socket_close()
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('message:'))
        div.appendChild(document.createElement('br'))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        input.addEventListener('keydown', function(evt) {
            if (evt.key == 'Enter')
                socket_send(mod.msg.value)
        })
        div.appendChild(input)
        mod.msg = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('response:'))
        div.appendChild(document.createElement('br'))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.resp = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('time (ms): '))
        div.appendChild(document.createElement('br'))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        div.appendChild(input)
        mod.time = input
    }
    //
    // local functions
    //
    function socket_open() {
        var url = "ws://" + mod.address.value + ':' + mod.port.value
        mod.socket = new WebSocket(url)
        mod.socket.onopen = function(event) {
            mod.status.value = "opened"
        }
        mod.socket.onerror = function(event) {
            mod.status.value = "can not open"
        }
        mod.socket.onmessage = function(event) {
            var t1 = get_time()
            mod.time.value = (t1 - mod.t0).toFixed(3)
            mod.status.value = "receive"
            mod.resp.value = event.data
            outputs.message.event(event.data)
        }
    }

    function socket_close() {
        mod.socket.close()
        mod.status.value = "closed"
        mod.socket = 0
    }

    function socket_send(msg) {
        if (mod.socket != 0) {
            mod.status.value = "send"
            mod.t0 = get_time()
            mod.socket.send(msg)
        } else {
            mod.status.value = "can't send, not open"
        }
    }

    function get_time() {
        if (window.performance != undefined)
            if (window.performance.now != undefined) {
                timer = "performance.now"
                return performance.now()
            }
        timer = "Date.now"
        return Date.now()
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

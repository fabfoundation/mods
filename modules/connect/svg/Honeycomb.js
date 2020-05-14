//
// Honeycomb module extracts flatten honeycomb sheet from Tools/FabLab Connect command of SolidWorks products
// 
// Shawn Liu @ Dassault Systemes SolidWorks Corporation
// (c) Massachusetts Institute of Technology 2019
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
// closure
//
(function(){
//
// module globals
//
var mod = {}
//
// name
//
var name = 'Honeycomb connect'
//
// initialization
//
var init = function() {
   mod.address = getParameterByName('swIP') || '127.0.0.1'
   mod.port = getParameterByName('swPort') || '80'
   mod.socket = 0
   socket_open()
   }
//
// inputs
//
var inputs = {}
//
// outputs
//
var outputs = {
    SVG: {
        type: 'string',
        event: function () {
            mods.output(mod, 'SVG', mod.str)
        }
    },
    file: {
        type: 'object',
        event: function (str) {
            obj = {}
            obj.name = mod.partName + ".svg"
            obj.contents = str
            mods.output(mod, 'file', obj)
        }
    }
}
//
// interface
//
var interface = function(div){
   mod.div = div

    // on-screen drawing canvas
    //
    var canvas = document.createElement('canvas')
    canvas.width = mods.ui.canvas
    canvas.height = mods.ui.canvas
    canvas.style.backgroundColor = 'rgb(255,255,255)'
    div.appendChild(canvas)
    mod.canvas = canvas
    div.appendChild(document.createElement('br'))
    //
    // off-screen image canvas
    //
    var canvas = document.createElement('canvas')
    mod.img = canvas

   div.appendChild(document.createTextNode('server:'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('address: ' + getParameterByName('swIP')))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0port: ' + getParameterByName('swPort')))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('\u00a0\u00a0status: '))
   input = document.createElement('input')
   input.type = 'text'
   input.size = 12
   div.appendChild(input)
   mod.status = input
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
   btn.style.margin = 1
   btn.appendChild(document.createTextNode('open'))
   btn.addEventListener('click', function () {
       socket_open()
   })
   div.appendChild(btn)
   var btn = document.createElement('button')
   btn.style.margin = 1
   btn.appendChild(document.createTextNode('close'))
   btn.addEventListener('click', function () {
       socket_close()
   })
   div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
   btn.style.margin = 1
   btn.appendChild(document.createTextNode('Extract SVG'))
   btn.addEventListener('click', function () {
       extract_SVG()
   })
   div.appendChild(btn)
   div.appendChild(document.createElement('br'))
    //
    // view button
    //
   var btn = document.createElement('button')
   btn.style.padding = mods.ui.padding
   btn.style.margin = 1
   btn.appendChild(document.createTextNode('view'))
   btn.addEventListener('click', function () {
       var win = window.open('')
       var btn = document.createElement('button')
       btn.appendChild(document.createTextNode('close'))
       btn.style.padding = mods.ui.padding
       btn.style.margin = 1
       btn.addEventListener('click', function () {
           win.close()
       })
       win.document.body.appendChild(btn)
       win.document.body.appendChild(document.createElement('br'))
       var canvas = document.createElement('canvas')
       canvas.width = mod.img.width
       canvas.height = mod.img.height
       win.document.body.appendChild(canvas)
       var ctx = canvas.getContext("2d")
       ctx.drawImage(mod.img, 0, 0)
   })
   div.appendChild(btn)
   div.appendChild(document.createElement('br'))

    //
    // info div
    //
   var info = document.createElement('div')
   info.setAttribute('id', div.id + 'info')
   mod.name = document.createTextNode('name:')
   info.appendChild(mod.name)
   mod.thickness = document.createTextNode('thickness: ')
   div.appendChild(mod.thickness)
   info.appendChild(document.createElement('br'))
   mod.width = document.createTextNode('width:')
   info.appendChild(mod.width)
   info.appendChild(document.createElement('br'))
   mod.height = document.createTextNode('height:')
   info.appendChild(mod.height)
   div.appendChild(info)

   }
//
// local functions
//

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function socket_open() {
   var url = "ws://"+mod.address+':'+mod.port
   mod.socket = new WebSocket(url)
   mod.socket.onopen = function(event) {
       mod.status.value = "opened"
       var connect = {}
       connect.modCmd = 'connect'
       connect.owner = getParameterByName('swOwner')
       connect.id = getParameterByName('swID')
       socket_send(JSON.stringify(connect))
      }
   mod.socket.onerror = function(event) {
      mod.status.value = "can not open"
      }
   mod.socket.onmessage = function(event) {
      mod.status.value = "receive"
      var swData = JSON.parse(event.data);
      if (swData.swType === "HoneycombFlattenSVG") {
          mod.partName = swData.data.partName
          var partName = swData.data.partName
          if (partName.length > 25)
              partName = partName.slice(0, 22) + '...'
          mod.name.nodeValue = "name: " + partName
          mod.thickness.nodeValue = "thickness: " + swData.data.thickness + ' (mm)';
          mod.str = swData.data.svg
          svg_load_handler()
          outputs.SVG.event(mod.str)
          outputs.file.event(mod.str)
      }
   }
   mod.socket.onclose = function (event) {
       mod.status.value = "connection closed"
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
      mod.socket.send(msg)
      }
   else {
      mod.status.value = "can't send, not open"
      }
   }
function extract_SVG() {
   var modcmd = new Object;
   modcmd.modCmd = "AutoHoneycombFlatten";
   socket_send(JSON.stringify(modcmd))
   }

    //
    // load handler
    //
function svg_load_handler() {
    //
    // parse size
    //
    var i = mod.str.indexOf("width")
    if (i == -1) {
        mod.width.nodeValue = "width: not found"
        mod.height.nodeValue = "height: not found"
    }
    else {
        var i1 = mod.str.indexOf("\"", i + 1)
        var i2 = mod.str.indexOf("\"", i1 + 1)
        var width = mod.str.substring(i1 + 1, i2)
        i = mod.str.indexOf("height")
        i1 = mod.str.indexOf("\"", i + 1)
        i2 = mod.str.indexOf("\"", i1 + 1)
        var height = mod.str.substring(i1 + 1, i2)
        ih = mod.str.indexOf("height")
        if (width.indexOf("px") != -1) {
            width = width.slice(0, -2)
            height = height.slice(0, -2)
            var units = 90
        }
        else if (width.indexOf("mm") != -1) {
            width = width.slice(0, -2)
            height = height.slice(0, -2)
            var units = 25.4
        }
        else if (width.indexOf("cm") != -1) {
            width = width.slice(0, -2)
            height = height.slice(0, -2)
            var units = 2.54
        }
        else if (width.indexOf("in") != -1) {
            width = width.slice(0, -2)
            height = height.slice(0, -2)
            var units = 1
        }
        else {
            var units = 90
        }
        mod.width.nodeValue = "width: " + width / 3.543307 + ' (mm)';
        mod.height.nodeValue = "height: " + height / 3.543307 + ' (mm)';
    }
    //
    // display
    //
    var img = new Image()
    var src = "data:image/svg+xml;base64," + window.btoa(mod.str)
    img.setAttribute("src", src)
    img.onload = function () {
        if (img.width > img.height) {
            var x0 = 0
            var y0 = mod.canvas.height * .5 * (1 - img.height / img.width)
            var w = mod.canvas.width
            var h = mod.canvas.width * img.height / img.width
        }
        else {
            var x0 = mod.canvas.width * .5 * (1 - img.width / img.height)
            var y0 = 0
            var w = mod.canvas.height * img.width / img.height
            var h = mod.canvas.height
        }
        var ctx = mod.canvas.getContext("2d")
        ctx.clearRect(0, 0, mod.canvas.width, mod.canvas.height)
        ctx.drawImage(img, x0, y0, w, h)
        var ctx = mod.img.getContext("2d")
        ctx.canvas.width = img.width
        ctx.canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        outputs.SVG.event()
    }
}


//
// return values
//
return ({
   mod:mod,
   name:name,
   init:init,
   inputs:inputs,
   outputs:outputs,
   interface:interface
   })
}())

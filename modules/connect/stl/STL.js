//
// STL module extracts stl from Tools/FabLab Connect command of SolidWorks products
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
var name = 'STL connect'
//
// initialization
//
var init = function () {
    mod.address = getParameterByName('swIP') || '127.0.0.1'
    mod.port = getParameterByName('swPort') || '80'
    mod.socket = 0
    mod.sag.value = '0.1'
    mod.angle.value = '45'
    socket_open()
   }
//
// inputs
//
var inputs = {
   }
//
// outputs
//
var outputs = {
   mesh:{type:'STL',
      event:function(buffer){
         mods.output(mod,'mesh',buffer)}}
      }
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // canvas
   //
   var canvas = document.createElement('canvas')
      canvas.width = mods.ui.canvas
      canvas.height = mods.ui.canvas
      canvas.style.backgroundColor = 'rgb(255,255,255)'
      div.appendChild(canvas)
      mod.canvas = canvas
      div.appendChild(document.createElement('br'))

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
      div.appendChild(document.createTextNode('sag: '))
      input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.sag = input
      div.appendChild(document.createTextNode('(mm)'))
      div.appendChild(document.createElement('br'))
      div.appendChild(document.createTextNode('angle: '))
      input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.angle = input
      div.appendChild(document.createTextNode('(degree)'))
      div.appendChild(document.createElement('br'))
      var btn = document.createElement('button')
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('Extract STL'))
      btn.addEventListener('click', function () {
          extract_STL()
      })
      div.appendChild(btn)

   //
   // info
   //
   var info = document.createElement('div')
   info.setAttribute('id', div.id + 'info')
       var text = document.createTextNode('name: ')
       info.appendChild(text)
       mod.name = text
       info.appendChild(document.createElement('br'))
      var text = document.createTextNode('size: ')
         info.appendChild(text)
         mod.sizen = text
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('triangles: ')
         info.appendChild(text)
         mod.trianglesn = text
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('dx: ')
         info.appendChild(text)
         mod.dxn = text
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('dy: ')
         info.appendChild(text)
         mod.dyn = text
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('dz: ')
         info.appendChild(text)
         mod.dzn = text
         div.appendChild(info)
   }
//
// local functions
//

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
    var url = "ws://" + mod.address + ':' + mod.port
    mod.socket = new WebSocket(url)
    mod.socket.onopen = function (event) {
        mod.status.value = "opened"
        var connect = {}
        connect.modCmd = 'connect'
        connect.owner = getParameterByName('swOwner')
        connect.id = getParameterByName('swID')
        socket_send(JSON.stringify(connect))
    }
    mod.socket.onerror = function (event) {
        mod.status.value = "can not open"
    }
    mod.socket.onmessage = function (event) {
        mod.status.value = "receive"
        var swData = JSON.parse(event.data)
        if (swData.swType === "AutoExtractSTL") {
            var partName = swData.data.partName
            if (partName.length > 25)
                partName = partName.slice(0, 22) +'...'
            mod.name.nodeValue = "name: " + partName
            mod.str = swData.data.stl
            stl_load_handler()
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
function extract_STL() {
    var modcmd = new Object;
    modcmd.modCmd = "AutoExtractSTL";
    modcmd.sag = Number(mod.sag.value); // mm
    modcmd.angle = Number(mod.angle.value); //degree
    socket_send(JSON.stringify(modcmd))
}

function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

//
// load handler
//
function stl_load_handler() {
   //
   // check for binary STL
    //
   var arraybuf = base64ToArrayBuffer(mod.str)
   var endian = true
   var view = new DataView(arraybuf)
   var triangles = view.getUint32(80, endian)
   var size = 80+4+triangles*(4*12+2)
   if (size != view.byteLength) {
      mod.sizen.nodeValue = 'error: not binary STL'
      mod.trianglesn.nodeValue = ''
      mod.dxn.nodeValue = ''
      mod.dyn.nodeValue = ''
      mod.dzn.nodeValue = ''
      return
      }
   mod.sizen.nodeValue = 'size: '+size
   mod.trianglesn.nodeValue = 'triangles: '+triangles
   //
   // find limits and draw
   //
   var blob = new Blob(['('+draw_limits_worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   var webworker = new Worker(url)
   webworker.addEventListener('message',function(evt) {
      //
      // worker response
      //
      window.URL.revokeObjectURL(url)
      //
      // size
      //
      mod.dxn.nodeValue = 'dx: '+evt.data.dx.toFixed(3)
      mod.dyn.nodeValue = 'dy: '+evt.data.dy.toFixed(3)
      mod.dzn.nodeValue = 'dz: '+evt.data.dz.toFixed(3)
      //
      // image
      //
      var image = evt.data.image
      var height = mod.canvas.height
      var width = mod.canvas.width
      var buffer = new Uint8ClampedArray(evt.data.image)
      var imgdata = new ImageData(buffer,width,height)
      var ctx = mod.canvas.getContext("2d")
      ctx.putImageData(imgdata,0,0)
      //
      // output
      //
      outputs.mesh.event(evt.data.mesh)
      })
   var ctx = mod.canvas.getContext("2d")
   ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
   var img = ctx.getImageData(0, 0, mod.canvas.width, mod.canvas.height)
   //
   // call worker
   //
   webworker.postMessage({
      height:mod.canvas.height,width:mod.canvas.width,
      image: img.data.buffer, mesh: arraybuf},
      [img.data.buffer, arraybuf])
   }
function draw_limits_worker() {
   self.addEventListener('message',function(evt) {
      //
      // function to draw line
      //
      function line(x0,y0,x1,y1) {
         var ix0 = Math.floor(xo+xw*(x0-xmin)/dx)
         var iy0 = Math.floor(yo+yh*(ymax-y0)/dy)
         var ix1 = Math.floor(xo+xw*(x1-xmin)/dx)
         var iy1 = Math.floor(yo+yh*(ymax-y1)/dy)
         var row,col
         var idx = ix1-ix0
         var idy = iy1-iy0
         if (Math.abs(idy) > Math.abs(idx)) {
            (idy > 0) ?
               (row0=iy0,col0=ix0,row1=iy1,col1=ix1):
               (row0=iy1,col0=ix1,row1=iy0,col1=ix0)
            for (row = row0; row <= row1; ++row) {
               col = Math.floor(col0+(col1-col0)*(row-row0)/(row1-row0))
               image[row*width*4+col*4+0] = 0
               image[row*width*4+col*4+1] = 0
               image[row*width*4+col*4+2] = 0
               image[row*width*4+col*4+3] = 255
               }
            }
         else if ((Math.abs(idx) >= Math.abs(idy)) && (idx != 0)) {
            (idx > 0) ?
               (row0=iy0,col0=ix0,row1=iy1,col1=ix1):
               (row0=iy1,col0=ix1,row1=iy0,col1=ix0)
            for (col = col0; col <= col1; ++col) {
               row = Math.floor(row0+(row1-row0)*(col-col0)/(col1-col0))
               image[row*width*4+col*4+0] = 0
               image[row*width*4+col*4+1] = 0
               image[row*width*4+col*4+2] = 0
               image[row*width*4+col*4+3] = 255
               }
            }
         else {
            row = iy0
            col = ix0
            image[row*width*4+col*4+0] = 0
            image[row*width*4+col*4+1] = 0
            image[row*width*4+col*4+2] = 0
            image[row*width*4+col*4+3] = 255
            }
         }
      //
      // get variables
      //
      var height = evt.data.height
      var width = evt.data.width
      var endian = true
      var image = new Uint8ClampedArray(evt.data.image)
      var view = new DataView(evt.data.mesh)
      var triangles = view.getUint32(80,endian)
      //
      // find limits
      //
      var offset = 80+4
      var x0,x1,x2,y0,y1,y2,z0,z1,z2
      var xmin = Number.MAX_VALUE
      var xmax = -Number.MAX_VALUE
      var ymin = Number.MAX_VALUE
      var ymax = -Number.MAX_VALUE
      var zmin = Number.MAX_VALUE
      var zmax = -Number.MAX_VALUE
      for (var t = 0; t < triangles; ++t) {
         offset += 3*4
         x0 = view.getFloat32(offset,endian)
         offset += 4
         if (x0 > xmax) xmax = x0
         if (x0 < xmin) xmin = x0
         y0 = view.getFloat32(offset,endian)
         offset += 4
         if (y0 > ymax) ymax = y0
         if (y0 < ymin) ymin = y0
         z0 = view.getFloat32(offset,endian)
         offset += 4
         if (z0 > zmax) zmax = z0
         if (z0 < zmin) zmin = z0
         x1 = view.getFloat32(offset,endian)
         offset += 4
         if (x1 > xmax) xmax = x1
         if (x1 < xmin) xmin = x1
         y1 = view.getFloat32(offset,endian)
         offset += 4
         if (y1 > ymax) ymax = y1
         if (y1 < ymin) ymin = y1
         z1 = view.getFloat32(offset,endian)
         offset += 4
         if (z1 > zmax) zmax = z1
         if (z1 < zmin) zmin = z1
         x2 = view.getFloat32(offset,endian)
         offset += 4
         if (x2 > xmax) xmax = x2
         if (x2 < xmin) xmin = x2
         y2 = view.getFloat32(offset,endian)
         offset += 4
         if (y2 > ymax) ymax = y2
         if (y2 < ymin) ymin = y2
         z2 = view.getFloat32(offset,endian)
         offset += 4
         if (z2 > zmax) zmax = z2
         if (z2 < zmin) zmin = z2
         offset += 2
         }
      var dx = xmax-xmin
      var dy = ymax-ymin
      var dz = zmax-zmin
      //
      // draw mesh
      //
      if (dx > dy) {
         var xo = 0
         var yo = height*.5*(1-dy/dx)
         var xw = width-1
         var yh = (width-1)*dy/dx
         }
      else {
         var xo = width*.5*(1-dx/dy)
         var yo = 0
         var xw = (height-1)*dx/dy
         var yh = height-1
         }
      offset = 80+4
      for (var t = 0; t < triangles; ++t) {
         offset += 3*4
         x0 = view.getFloat32(offset,endian)
         offset += 4
         y0 = view.getFloat32(offset,endian)
         offset += 4
         z0 = view.getFloat32(offset,endian)
         offset += 4
         x1 = view.getFloat32(offset,endian)
         offset += 4
         y1 = view.getFloat32(offset,endian)
         offset += 4
         z1 = view.getFloat32(offset,endian)
         offset += 4
         x2 = view.getFloat32(offset,endian)
         offset += 4
         y2 = view.getFloat32(offset,endian)
         offset += 4
         z2 = view.getFloat32(offset,endian)
         offset += 4
         offset += 2
         line(x0,y0,x1,y1)
         line(x1,y1,x2,y2)
         line(x2,y2,x0,y0)
         }
      //
      // return results and close
      //
      self.postMessage({
         dx:dx,dy:dy,dz:dz,
         image:evt.data.image,mesh:evt.data.mesh},[evt.data.image,evt.data.mesh])
      self.close()
      })
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

//
// frep render (CPU)
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2018
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
var name = 'frep render (CPU)'
//
// initialization
//
var init = function() {
   mod.width.value = 255
   }
//
// inputs
//
var inputs = {
   shape:{type:'frep',
      event:function(evt){
         mod.fn.value = evt.detail.function
         render(evt.detail)
         }}}
//
// outputs
//
var outputs = {
   image:{type:'RGBA',
      event:function(){
         var ctx = mod.img.getContext("2d")
         var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
         mods.output(mod,'image',img)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
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
   //
   // width
   //
   div.appendChild(document.createTextNode('width: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(){
         mod.height.value = ''
         mod.depth.value = ''
         })
      div.appendChild(input)
      mod.width = input
   //
   // height
   //
   div.appendChild(document.createTextNode(' height: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(){
         mod.width.value = ''
         mod.depth.value = ''
         })
      div.appendChild(input)
      mod.height = input
   div.appendChild(document.createElement('br'))
   //
   // depth
   //
   div.appendChild(document.createTextNode(' depth: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(){
         mod.width.value = ''
         mod.height.value = ''
         })
      div.appendChild(input)
      mod.depth = input
   div.appendChild(document.createElement('br'))
   //
   // function
   //
   div.appendChild(document.createTextNode('function: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.fn = input
   div.appendChild(document.createElement('br'))
   //
   // view button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('view'))
      btn.addEventListener('click',function(){
         mod.win = window.open('')
         mod.win.document.body.style.overflow = 'hidden'
         mod.win.document.body.style.border = 0
         mod.win.document.body.style.padding = 0
         mod.win.document.body.style.margin = 0
         mod.win.addEventListener('unload',function() {
            mod.win = null
            })
         var canvas = document.createElement('canvas')
            canvas.setAttribute('id',mod.div.id+'canvas')
            mod.win.document.body.appendChild(canvas)
         var ctx = canvas.getContext("2d")
         canvas.width = window.innerWidth
         canvas.height = window.innerWidth
         var h = mod.img.height
         var w = mod.img.width
         if (w > h) {
            var wd = canvas.width
            var hd = canvas.width*h/w
            }
         else {
            var wd = canvas.height*w/h
            var hd = canvas.height
            }
         ctx.fillStyle = '#dddddd'
         ctx.fillRect(0,0,canvas.width,canvas.height)
         ctx.drawImage(mod.img,0,0,wd,hd)
         })
      div.appendChild(btn)
   }
//
// local functions
//
// render
//
function render(shape) {   
   var fn = shape.function
   var vars = shape.variables
   var limits = shape.limits
   var type = shape.type
   var w = parseInt(mod.width.value)
   var h = parseInt(mod.height.value)
   var d = parseInt(mod.depth.value)
   var xvar = vars[0]
   var xlimits = limits[0]
   var yvar = vars[1]
   var ylimits = limits[1]
   var zvar = vars[2]
   var zlimits = limits[2]
   if (!isNaN(w)) {
      h = Math.floor(w*(ylimits[1]-ylimits[0])/(xlimits[1]-xlimits[0]))
      d = Math.floor(w*(zlimits[1]-zlimits[0])/(xlimits[1]-xlimits[0]))
      }
   else if (!isNaN(h)) {
      w = Math.floor(h*(xlimits[1]-xlimits[0])/(ylimits[1]-ylimits[0]))
      d = Math.floor(h*(zlimits[1]-zlimits[0])/(ylimits[1]-ylimits[0]))
      }
   else {
      w = Math.floor(d*(xlimits[1]-xlimits[0])/(zlimits[1]-zlimits[0]))
      h = Math.floor(d*(ylimits[1]-ylimits[0])/(zlimits[1]-zlimits[0]))
      }
   mod.img.height = h
   mod.img.width = w
   var blob = new Blob(['('+worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   var webworker = new Worker(url)
   webworker.addEventListener('message',function(evt) {
      window.URL.revokeObjectURL(url)
      var h = mod.img.height
      var w = mod.img.width
      var buf = new Uint8ClampedArray(evt.data.buffer)
      var imgdata = new ImageData(buf,w,h)
      var ctx = mod.img.getContext("2d")
      ctx.putImageData(imgdata,0,0)
      if (w > h) {
         var x0 = 0
         var y0 = mod.canvas.height*.5*(1-h/w)
         var wd = mod.canvas.width
         var hd = mod.canvas.width*h/w
         }
      else {
         var x0 = mod.canvas.width*.5*(1-w/h)
         var y0 = 0
         var wd = mod.canvas.height*w/h
         var hd = mod.canvas.height
         }
      var ctx = mod.canvas.getContext("2d")
      ctx.fillStyle = '#dddddd'
      ctx.fillRect(0,0,mod.canvas.width,mod.canvas.height)
      ctx.drawImage(mod.img,x0,y0,wd,hd)
      if (mod.win != null) {
         var canvas = mod.win.document.getElementById(mod.div.id+'canvas')
         var ctx = canvas.getContext("2d")
         canvas.width = window.innerWidth
         canvas.height = window.innerWidth
         var h = mod.img.height
         var w = mod.img.width
         if (w > h) {
            var wd = canvas.width
            var hd = canvas.width*h/w
            }
         else {
            var wd = canvas.height*w/h
            var hd = canvas.height
            }
         ctx.fillStyle = '#dddddd'
         ctx.fillRect(0,0,canvas.width,canvas.height)
         ctx.drawImage(mod.img,0,0,wd,hd)
         }
      webworker.terminate()
      outputs.image.event()
      })
   var ctx = mod.canvas.getContext("2d")
   ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
   var ctx = mod.img.getContext("2d")
   ctx.clearRect(0,0,mod.img.width,mod.img.height)
   var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
   webworker.postMessage({
      height:h,width:w,depth:d,
      xvar:xvar,yvar:yvar,zvar:zvar,
      xlimits:xlimits,ylimits:ylimits,zlimits:zlimits,
      function:fn,
      buffer:img.data.buffer},
      [img.data.buffer])
   }
//
// worker
//
function worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var d = evt.data.depth
      var xvar = evt.data.xvar
      var yvar = evt.data.yvar
      var zvar = evt.data.zvar
      var xlimits = evt.data.xlimits
      var ylimits = evt.data.ylimits
      var zlimits = evt.data.zlimits
      var buf = new Uint8ClampedArray(evt.data.buffer)
      var f = new Function(xvar,yvar,zvar,'return ('+evt.data.function+')')
      var x,y,z,v
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            buf[(h-1-row)*w*4+col*4+0] = 0
            buf[(h-1-row)*w*4+col*4+1] = 0
            buf[(h-1-row)*w*4+col*4+2] = 0
            buf[(h-1-row)*w*4+col*4+3] = 255
            }
         }
      for (var layer = 0; layer < d; ++layer) {
         z = zlimits[0]+(zlimits[1]-zlimits[0])*layer/(d-1)
         v = Math.floor(255*layer/(d-1))
         for (var row = 0; row < h; ++row) {
            y = ylimits[0]+(ylimits[1]-ylimits[0])*row/(h-1)
            for (var col = 0; col < w; ++col) {
               x = xlimits[0]+(xlimits[1]-xlimits[0])*col/(w-1)
               if (f(x,y,z) >= 0) {
                  buf[(h-1-row)*w*4+col*4+0] = v
                  buf[(h-1-row)*w*4+col*4+1] = v
                  buf[(h-1-row)*w*4+col*4+2] = v
                  }
               }
            }
         }
      self.postMessage({buffer:buf.buffer},[buf.buffer])
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

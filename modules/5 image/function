//
// image function
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2015,6
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
var name = 'image function'
//
// initialization
//
var init = function() {
   mod.width.value = 1000
   mod.height.value = 1000
   mod.win = null
   }
//
// inputs
//
var inputs = {
   function:{type:'object',
      event:function(evt){
         mod.input = evt.detail
         /*
         mod.input.arguments = 'x,y,w,h,m'
         mod.input.function = '\
            var r = m*x/w;\
            var g = m*y/h;\
            var b = m*x/w+y/h;\
            var a = m;\
            return [r,g,b,a]'
         */
         var ctx = mod.img.getContext("2d")
         ctx.canvas.width = parseInt(mod.width.value)
         ctx.canvas.height = parseInt(mod.height.value)
         image_function()
         }}}
//
// outputs
//
var outputs = {
   image:{type:'RGBA',
      event:function(){
         var ctx = mod.img.getContext("2d")
         var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
         mods.output(mod,'image',img)}}}
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
      input.size = 6
      div.appendChild(input)
      mod.width = input
   div.appendChild(document.createElement('br'))
   //
   // height
   //
   div.appendChild(document.createTextNode('height: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.height = input
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
            canvas.width = mod.img.width
            canvas.height = mod.img.height
            canvas.setAttribute('id',mod.div.id+'canvas')
            mod.win.document.body.appendChild(canvas)
         var ctx = canvas.getContext("2d")
            ctx.drawImage(mod.img,0,0)
         })
      div.appendChild(btn)
   }
//
// local functions
//
// image_function
//
function image_function() {
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
      ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
      ctx.drawImage(mod.img,x0,y0,wd,hd)
      if (mod.win != null) {
         var canvas = mod.win.document.getElementById(mod.div.id+'canvas')
         canvas.width = mod.img.width
         canvas.height = mod.img.height
         var ctx = canvas.getContext("2d")
         ctx.clearRect(0,0,mod.img.width,mod.img.height)
         ctx.drawImage(mod.img,0,0)
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
      height:img.height,width:img.width,
      args:mod.input.arguments,func:mod.input.function,
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
      var m = 255
      var f = new Function(evt.data.args,evt.data.func)
      var buf = new Uint8ClampedArray(evt.data.buffer)
      var r,g,b,a,i
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            buf[(h-1-row)*w*4+col*4+0] = f(col,row,w,h,m)[0]
            buf[(h-1-row)*w*4+col*4+1] = f(col,row,w,h,m)[1]
            buf[(h-1-row)*w*4+col*4+2] = f(col,row,w,h,m)[2]
            buf[(h-1-row)*w*4+col*4+3] = f(col,row,w,h,m)[3]
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

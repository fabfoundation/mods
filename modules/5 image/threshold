//
// image threshold
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
var name = 'image threshold'
//
// initialization
//
var init = function() {
   mod.threshold.value = 0.5
   }
//
// inputs
//
var inputs = {
   image:{type:'RGBA',
      event:function(evt){
         mod.input = evt.detail
         var ctx = mod.img.getContext("2d")
         ctx.canvas.width = mod.input.width
         ctx.canvas.height = mod.input.height 
         ctx.putImageData(mod.input,0,0)
         threshold_image()}}}
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
   // threshold value
   //
   div.appendChild(document.createTextNode('threshold (0-1): '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         threshold_image()
         })
      div.appendChild(input)
      mod.threshold = input
   div.appendChild(document.createElement('br'))
   //
   // view button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('view'))
      btn.addEventListener('click',function(){
         var win = window.open('')
         var btn = document.createElement('button')
            btn.appendChild(document.createTextNode('close'))
            btn.style.padding = mods.ui.padding
            btn.style.margin = 1
            btn.addEventListener('click',function(){
               win.close()
               })
            win.document.body.appendChild(btn)
         win.document.body.appendChild(document.createElement('br'))
         var canvas = document.createElement('canvas')
            canvas.width = mod.img.width
            canvas.height = mod.img.height
            win.document.body.appendChild(canvas)
         var ctx = canvas.getContext("2d")
            ctx.drawImage(mod.img,0,0)
         })
      div.appendChild(btn)
   }
//
// local functions
//
// threshold image
//
function threshold_image() {
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
      webworker.terminate()
      outputs.image.event()
      })
   var ctx = mod.canvas.getContext("2d")
   ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
   var t = parseFloat(mod.threshold.value)
   var ctx = mod.img.getContext("2d")
   ctx.putImageData(mod.input,0,0)
   var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
   webworker.postMessage({
      height:mod.input.height,width:mod.input.width,threshold:t,
      buffer:img.data.buffer},
      [img.data.buffer])
   }
function worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var t = evt.data.threshold
      var buf = new Uint8ClampedArray(evt.data.buffer)
      var r,g,b,a,i
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            r = buf[(h-1-row)*w*4+col*4+0] 
            g = buf[(h-1-row)*w*4+col*4+1] 
            b = buf[(h-1-row)*w*4+col*4+2] 
            a = buf[(h-1-row)*w*4+col*4+3] 
            i = (r+g+b)/(3*255)
            if (a == 0)
               val = 255
            else if (i > t)
               var val = 255
            else
               var val = 0
            buf[(h-1-row)*w*4+col*4+0] = val
            buf[(h-1-row)*w*4+col*4+1] = val
            buf[(h-1-row)*w*4+col*4+2] = val
            buf[(h-1-row)*w*4+col*4+3] = 255
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

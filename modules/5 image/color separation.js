//
// image color separation
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2017
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
var name = 'color separation'
//
// initialization
//
var init = function() {
   mod.input = null
   mod.color.value = '[255,0,0]'
   mod.fill.checked = false
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
         var ctx = mod.convert.getContext("2d")
         ctx.canvas.width = mod.input.width
         ctx.canvas.height = mod.input.height 
         show_separation()
         }
      },
   color:{type:'RGB',
      event:function(evt){
         mod.color.value = JSON.stringify(evt.detail)
         }
      }
   }
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
   // off-screen conversion canvas
   //
   var canvas = document.createElement('canvas')
      mod.convert = canvas
   //
   // view
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
   div.appendChild(document.createElement('br'))
   //
   // image 
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      var span = document.createElement('span')
         var text = document.createTextNode('original')
            span.appendChild(text)
         span.style.fontWeight = 'normal'
         btn.appendChild(span)
         mod.originalspan = span
      btn.addEventListener('click',function(){
         mod.originalspan.style.fontWeight = 'bold'
         mod.palettespan.style.fontWeight = 'normal'
         show_original()
         })
      div.appendChild(btn)
   div.appendChild(document.createTextNode(' image '))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      var span = document.createElement('span')
         var text = document.createTextNode('separation')
            span.appendChild(text)
         span.style.fontWeight = 'bold'
         btn.appendChild(span)
         mod.palettespan = span
      btn.addEventListener('click',function(){
         mod.originalspan.style.fontWeight = 'normal'
         mod.palettespan.style.fontWeight = 'bold'
         show_separation()
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   //
   // color
   //
   div.appendChild(document.createTextNode('color: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.color = input
   div.appendChild(document.createElement('br'))
   //
   // edges
   //
   div.appendChild(document.createTextNode('fill edges: '))
   var input = document.createElement('input')
      input.type = 'checkbox'
      input.id = mod.div.id+'fill'
      div.appendChild(input)
      mod.fill = input
   div.appendChild(document.createElement('br'))
   //
   // edges
   //
   div.appendChild(document.createTextNode('invert: '))
   var input = document.createElement('input')
      input.type = 'checkbox'
      input.id = mod.div.id+'fill'
      div.appendChild(input)
      mod.invert = input
   div.appendChild(document.createElement('br'))
   }
//
// local functions
//
// show_original
//
function show_original() {
   var h = mod.img.height
   var w = mod.img.width
   var ctx = mod.img.getContext("2d")
   ctx.putImageData(mod.input,0,0)
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
   }
//
// show separation
//
function show_separation() {
   var blob = new Blob(['('+separation_worker.toString()+'())'])
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
   var ctx = mod.img.getContext("2d")
   ctx.putImageData(mod.input,0,0)
   var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
   var color = JSON.parse(mod.color.value)
   webworker.postMessage({
      height:mod.input.height,width:mod.input.width,color:color,
      fill:mod.fill.checked,invert:mod.invert.checked,
      buffer:img.data.buffer},[img.data.buffer])
   }
//
// separation worker
//
function separation_worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var color = evt.data.color
      var fill = evt.data.fill
      if (evt.data.invert) {
         var low = 255
         var high = 0
         }
      else {
         var low = 0
         var high = 255
         }
      var buf = new Uint8ClampedArray(evt.data.buffer)
      var r,g,b,a,rc,gc,bc
      var cmin,dmin,d      
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            r = buf[(h-1-row)*w*4+col*4+0] 
            g = buf[(h-1-row)*w*4+col*4+1] 
            b = buf[(h-1-row)*w*4+col*4+2] 
            a = buf[(h-1-row)*w*4+col*4+3] 
            rc = color[0]
            gc = color[1]
            bc = color[2]
            if ((rc == r) && (gc == g) && (bc == b)) {
               buf[(h-1-row)*w*4+col*4+0] = high
               buf[(h-1-row)*w*4+col*4+1] = high
               buf[(h-1-row)*w*4+col*4+2] = high
               buf[(h-1-row)*w*4+col*4+3] = 255
               }
            else {
               buf[(h-1-row)*w*4+col*4+0] = low
               buf[(h-1-row)*w*4+col*4+1] = low
               buf[(h-1-row)*w*4+col*4+2] = low
               buf[(h-1-row)*w*4+col*4+3] = 255
               }
            }
         }
      if (fill == true) {
         for (var row = 0; row < h; ++row) {
            col = 0
            buf[(h-1-row)*w*4+col*4+0] = low
            buf[(h-1-row)*w*4+col*4+1] = low
            buf[(h-1-row)*w*4+col*4+2] = low
            buf[(h-1-row)*w*4+col*4+3] = 255
            col = w-1
            buf[(h-1-row)*w*4+col*4+0] = low
            buf[(h-1-row)*w*4+col*4+1] = low
            buf[(h-1-row)*w*4+col*4+2] = low
            buf[(h-1-row)*w*4+col*4+3] = 255
            }
         for (var col = 0; col < w; ++col) {
            row = 0
            buf[(h-1-row)*w*4+col*4+0] = low
            buf[(h-1-row)*w*4+col*4+1] = low
            buf[(h-1-row)*w*4+col*4+2] = low
            buf[(h-1-row)*w*4+col*4+3] = 255
            row = h-1
            buf[(h-1-row)*w*4+col*4+0] = low
            buf[(h-1-row)*w*4+col*4+1] = low
            buf[(h-1-row)*w*4+col*4+2] = low
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

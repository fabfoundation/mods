//
// image palette
//    todo: linear time palette search
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
var name = 'image palette'
//
// initialization
//
var init = function() {
   mod.palette.value = '[[255,255,255,"white"],\n[0,0,0,"black"],\n[255,0,0,"red"],\n[0,255,0,"green"],\n[0,0,255,"blue"],\n[255,255,0],\n[255,0,255],\n[0,255,255]]'
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
         show_palette()
         }
      },
   palette:{type:'text',
      event:function(evt){
         mod.palette.value = evt.detail
         show_palette()
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
         mods.output(mod,'image',img)}},
   palette:{type:'text',
      event:function(){
         mods.output(mod,'palette',mod.palette.value)
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
         var text = document.createTextNode('palette')
            span.appendChild(text)
         span.style.fontWeight = 'bold'
         btn.appendChild(span)
         mod.palettespan = span
      btn.addEventListener('click',function(){
         mod.originalspan.style.fontWeight = 'normal'
         mod.palettespan.style.fontWeight = 'bold'
         show_palette()
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   //
   // palette
   //
   div.appendChild(document.createTextNode('palette'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',mods.ui.rows)
      text.setAttribute('cols',mods.ui.cols)
      div.appendChild(text)
      mod.palette = text
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
// show palette
//
function show_palette() {
   var blob = new Blob(['('+palette_worker.toString()+'())'])
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
      outputs.palette.event()
      outputs.image.event()
      })
   var ctx = mod.canvas.getContext("2d")
   ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
   var ctx = mod.img.getContext("2d")
   ctx.putImageData(mod.input,0,0)
   var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
   var palette = JSON.parse(mod.palette.value)
   webworker.postMessage({
      height:mod.input.height,width:mod.input.width,palette:palette,
      buffer:img.data.buffer},
      [img.data.buffer])
   }
//
// palette worker
//    todo: sort palette
//
function palette_worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var palette = evt.data.palette
      var buf = new Uint8ClampedArray(evt.data.buffer)
      var r,g,b,a,rc,gc,bc
      var cmin,dmin,d
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            r = buf[(h-1-row)*w*4+col*4+0] 
            g = buf[(h-1-row)*w*4+col*4+1] 
            b = buf[(h-1-row)*w*4+col*4+2] 
            a = buf[(h-1-row)*w*4+col*4+3] 
            dmin = Number.MAX_VALUE
            for (color = 0; color < palette.length; ++color) {
               rc = palette[color][0]
               gc = palette[color][1]
               bc = palette[color][2]
               d = Math.sqrt(
                  (rc-r)*(rc-r)+
                  (gc-g)*(gc-g)+
                  (bc-b)*(bc-b))
               if (d < dmin) {
                  dmin = d
                  cmin = color
                  }
               }
            buf[(h-1-row)*w*4+col*4+0] = palette[cmin][0]
            buf[(h-1-row)*w*4+col*4+1] = palette[cmin][1]
            buf[(h-1-row)*w*4+col*4+2] = palette[cmin][2]
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

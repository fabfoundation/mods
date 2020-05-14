//
// orient edges
//    input is green:interior, blue:exterior, red:boundary
//    output is red 128:north,64:south, green 128:east,64:west, blue 128:start,64:stop
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
(function(){
//
// module globals
//
var mod = {}
//
// name
//
var name = 'orient edges'
//
// initialization
//
var init = function() {
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
         var ctx = mod.display.getContext("2d")
         ctx.canvas.width = mod.input.width
         ctx.canvas.height = mod.input.height 
         orient_edges()
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
   // off-screen display canvas
   //
   var canvas = document.createElement('canvas')
      mod.display = canvas
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
         win.document.body.appendChild(document.createTextNode('red:north, dark red:south'))
         win.document.body.appendChild(document.createElement('br'))
         win.document.body.appendChild(document.createTextNode('green:east, dark green:west'))
         win.document.body.appendChild(document.createElement('br'))
         win.document.body.appendChild(document.createTextNode('blue:start, dark blue:stop'))
         win.document.body.appendChild(document.createElement('br'))
         var canvas = document.createElement('canvas')
            canvas.width = mod.img.width
            canvas.height = mod.img.height
            win.document.body.appendChild(canvas)
         var ctx = canvas.getContext("2d")
            ctx.drawImage(mod.display,0,0)
         })
      div.appendChild(btn)
   }
//
// local functions
//
// orient edges
//
function orient_edges() {
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
      var disp = new Uint8ClampedArray(evt.data.display)
      var dispdata = new ImageData(disp,w,h)
      var ctx = mod.display.getContext("2d")
      ctx.putImageData(dispdata,0,0)
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
      var w = mod.canvas.width
      var h = mod.canvas.height
      var ctx = mod.canvas.getContext("2d")
      ctx.clearRect(0,0,w,h)
      ctx.drawImage(mod.display,x0,y0,wd,hd)
      webworker.terminate()
      outputs.image.event()
      })
   var ctx = mod.canvas.getContext("2d")
   ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
   webworker.postMessage({
      height:mod.input.height,width:mod.input.width,
      buffer:mod.input.data.buffer},
      [mod.input.data.buffer])
   }
function worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var input = new Uint8ClampedArray(evt.data.buffer)
      var output = new Uint8ClampedArray(h*w*4)
      var row,col
      var boundary = 0
      var interior = 1
      var exterior = 2
      var alpha = 3
      var northsouth = 0
      var north = 128
      var south = 64
      var eastwest = 1
      var east = 128
      var west = 64
      var startstop = 2
      var start = 128
      var stop = 64
      //
      // orient body states
      //
      for (row = 1; row < (h-1); ++row) {
         for (col = 1; col < (w-1); ++col) {
            output[(h-1-row)*w*4+col*4+northsouth] = 0
            output[(h-1-row)*w*4+col*4+eastwest] = 0
            output[(h-1-row)*w*4+col*4+startstop] = 0
            output[(h-1-row)*w*4+col*4+alpha] = 255
            if (input[(h-1-(row))*w*4+(col)*4+boundary] != 0) {
               if ((input[(h-1-(row+1))*w*4+(col)*4+boundary] != 0)
                  && ((input[(h-1-(row))*w*4+(col+1)*4+interior] != 0)
                  || (input[(h-1-(row+1))*w*4+(col+1)*4+interior] != 0)))
                  output[(h-1-row)*w*4+col*4+northsouth] |= north
               if ((input[(h-1-(row-1))*w*4+(col)*4+boundary] != 0)
                  && ((input[(h-1-(row))*w*4+(col-1)*4+interior] != 0)
                  || (input[(h-1-(row-1))*w*4+(col-1)*4+interior] != 0)))
                  output[(h-1-row)*w*4+col*4+northsouth] |= south
               if ((input[(h-1-(row))*w*4+(col+1)*4+boundary] != 0)
                  && ((input[(h-1-(row-1))*w*4+(col)*4+interior] != 0)
                  || (input[(h-1-(row-1))*w*4+(col+1)*4+interior] != 0)))
                  output[(h-1-row)*w*4+col*4+eastwest] |= east
               if ((input[(h-1-(row))*w*4+(col-1)*4+boundary] != 0)
                  && ((input[(h-1-(row+1))*w*4+(col)*4+interior] != 0)
                  || (input[(h-1-(row+1))*w*4+(col-1)*4+interior] != 0)))
                  output[(h-1-row)*w*4+col*4+eastwest] |= west
               }
            }
         }
      //
      // orient edge states
      //
      for (col = 1; col < (w-1); ++col) {
         row = 0
         output[(h-1-row)*w*4+col*4+northsouth] = 0
         output[(h-1-row)*w*4+col*4+eastwest] = 0
         output[(h-1-row)*w*4+col*4+startstop] = 0
         output[(h-1-row)*w*4+col*4+alpha] = 255
         if (input[(h-1-(row))*w*4+(col)*4+boundary] != 0) {
            if ((input[(h-1-(row+1))*w*4+(col)*4+boundary] != 0)
               && (input[(h-1-(row))*w*4+(col+1)*4+interior] != 0)) {
               output[(h-1-row)*w*4+col*4+northsouth] |= north
               output[(h-1-row)*w*4+col*4+startstop] |= start
               }
            if (input[(h-1-(row))*w*4+(col-1)*4+interior] != 0)
               output[(h-1-row)*w*4+col*4+startstop] |= stop
            }
         row = h-1
         output[(h-1-row)*w*4+col*4+northsouth] = 0
         output[(h-1-row)*w*4+col*4+eastwest] = 0
         output[(h-1-row)*w*4+col*4+startstop] = 0
         output[(h-1-row)*w*4+col*4+alpha] = 255
         if (input[(h-1-(row))*w*4+(col)*4+boundary] != 0) {
            if (input[(h-1-(row))*w*4+(col+1)*4+interior] != 0)
               output[(h-1-row)*w*4+col*4+startstop] |= stop
            if ((input[(h-1-(row-1))*w*4+(col)*4+boundary] != 0)
               && (input[(h-1-(row))*w*4+(col-1)*4+interior] != 0)) {
               output[(h-1-row)*w*4+col*4+northsouth] |= south
               output[(h-1-row)*w*4+col*4+startstop] |= start
               }
            }
         }
      for (row = 1; row < (h-1); ++row) {
         col = 0
         output[(h-1-row)*w*4+col*4+northsouth] = 0
         output[(h-1-row)*w*4+col*4+eastwest] = 0
         output[(h-1-row)*w*4+col*4+startstop] = 0
         output[(h-1-row)*w*4+col*4+alpha] = 255
         if (input[(h-1-(row))*w*4+(col)*4+boundary] != 0) {
            if ((input[(h-1-(row))*w*4+(col+1)*4+boundary] != 0)
               && (input[(h-1-(row-1))*w*4+(col)*4+interior] != 0)) {
               output[(h-1-row)*w*4+col*4+eastwest] |= east
               output[(h-1-row)*w*4+col*4+startstop] |= start
               }
            if (input[(h-1-(row+1))*w*4+(col)*4+interior] != 0)
               output[(h-1-row)*w*4+col*4+startstop] |= stop
            }
         col = w-1
         output[(h-1-row)*w*4+col*4+northsouth] = 0
         output[(h-1-row)*w*4+col*4+eastwest] = 0
         output[(h-1-row)*w*4+col*4+startstop] = 0
         output[(h-1-row)*w*4+col*4+alpha] = 255
         if (input[(h-1-(row))*w*4+(col)*4+boundary] != 0) {
            if (input[(h-1-(row-1))*w*4+(col)*4+interior] != 0)
               output[(h-1-row)*w*4+col*4+startstop] |= stop
            if ((input[(h-1-(row))*w*4+(col-1)*4+boundary] != 0)
               && (input[(h-1-(row+1))*w*4+(col)*4+interior] != 0)) {
               output[(h-1-row)*w*4+col*4+eastwest] |= west
               output[(h-1-row)*w*4+col*4+startstop] |= start
               }
            }
         }
      //
      // orient corner states (todo)
      //
      row = 0
      col = 0
      output[(h-1-row)*w*4+col*4+northsouth] = 0
      output[(h-1-row)*w*4+col*4+eastwest] = 0
      output[(h-1-row)*w*4+col*4+startstop] = 0
      output[(h-1-row)*w*4+col*4+alpha] = 255
      row = h-1
      col = 0
      output[(h-1-row)*w*4+col*4+northsouth] = 0
      output[(h-1-row)*w*4+col*4+eastwest] = 0
      output[(h-1-row)*w*4+col*4+startstop] = 0
      output[(h-1-row)*w*4+col*4+alpha] = 255
      row = 0
      col = w-1
      output[(h-1-row)*w*4+col*4+northsouth] = 0
      output[(h-1-row)*w*4+col*4+eastwest] = 0
      output[(h-1-row)*w*4+col*4+startstop] = 0
      output[(h-1-row)*w*4+col*4+alpha] = 255
      row = h-1
      col = w-1
      output[(h-1-row)*w*4+col*4+northsouth] = 0
      output[(h-1-row)*w*4+col*4+eastwest] = 0
      output[(h-1-row)*w*4+col*4+startstop] = 0
      output[(h-1-row)*w*4+col*4+alpha] = 255
      //
      // invert background for display
      //
      var display = new Uint8ClampedArray(h*w*4)
      var r,g,b,i
      for (row = 0; row < h; ++row) {
         for (col = 0; col < w; ++col) {
            r = output[(h-1-row)*w*4+col*4+0]
            g = output[(h-1-row)*w*4+col*4+1]
            b = output[(h-1-row)*w*4+col*4+2]
            i = r+g+b
            if (i != 0) {            
               display[(h-1-row)*w*4+col*4+0] = output[(h-1-row)*w*4+col*4+0]
               display[(h-1-row)*w*4+col*4+1] = output[(h-1-row)*w*4+col*4+1]
               display[(h-1-row)*w*4+col*4+2] = output[(h-1-row)*w*4+col*4+2]
               display[(h-1-row)*w*4+col*4+3] = output[(h-1-row)*w*4+col*4+3]
               }
            else {
               display[(h-1-row)*w*4+col*4+0] = 255
               display[(h-1-row)*w*4+col*4+1] = 255
               display[(h-1-row)*w*4+col*4+2] = 255
               display[(h-1-row)*w*4+col*4+3] = 255
               }
            }
         }
      //
      // return output
      //
      self.postMessage({buffer:output.buffer,display:display.buffer},[output.buffer,display.buffer])
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

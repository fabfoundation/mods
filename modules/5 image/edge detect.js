//
// edge detect
//    green = interior, blue = exterior, red = boundary
//    assumes input is thresholded
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
var name = 'edge detect'
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
         edge_detect()}}}
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
         win.document.body.appendChild(document.createTextNode('green:interior, blue:exterior, red:boundary'))
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
// edge detect
//
function edge_detect() {
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
   webworker.postMessage({worker:worker.toString(),
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
      var i00,i0m,i0p,im0,ip0,imm,imp,ipm,ipp,row,col
      //
      // find edges - interior
      //
      for (row = 1; row < (h-1); ++row) {
         for (col = 1; col < (w-1); ++col) {
            i00 = (input[(h-1-row)*w*4+col*4+0] 
                      +input[(h-1-row)*w*4+col*4+1] 
                      +input[(h-1-row)*w*4+col*4+2])
            i0p = (input[(h-1-row)*w*4+(col+1)*4+0] 
                      +input[(h-1-row)*w*4+(col+1)*4+1] 
                      +input[(h-1-row)*w*4+(col+1)*4+2])
            ip0 = (input[(h-2-row)*w*4+col*4+0] 
                      +input[(h-2-row)*w*4+col*4+1] 
                      +input[(h-2-row)*w*4+col*4+2])
            ipp = (input[(h-2-row)*w*4+(col+1)*4+0] 
                      +input[(h-2-row)*w*4+(col+1)*4+1] 
                      +input[(h-2-row)*w*4+(col+1)*4+2])
            i0m = (input[(h-1-row)*w*4+(col-1)*4+0] 
                      +input[(h-1-row)*w*4+(col-1)*4+1] 
                      +input[(h-1-row)*w*4+(col-1)*4+2])
            im0 = (input[(h-row)*w*4+col*4+0] 
                      +input[(h-row)*w*4+col*4+1] 
                      +input[(h-row)*w*4+col*4+2])
            imm = (input[(h-row)*w*4+(col-1)*4+0] 
                      +input[(h-row)*w*4+(col-1)*4+1] 
                      +input[(h-row)*w*4+(col-1)*4+2])
            imp = (input[(h-row)*w*4+(col+1)*4+0] 
                      +input[(h-row)*w*4+(col+1)*4+1] 
                      +input[(h-row)*w*4+(col+1)*4+2])
            ipm = (input[(h-2-row)*w*4+(col-1)*4+0] 
                      +input[(h-2-row)*w*4+(col-1)*4+1] 
                      +input[(h-2-row)*w*4+(col-1)*4+2])
            if ((i00 != i0p) || (i00 != ip0) || (i00 != ipp) 
               || (i00 != i0m) || (i00 != im0) || (i00 != imm)
               || (i00 != imp) || (i00 != ipm)) {
               output[(h-1-row)*w*4+col*4+0] = 255
               output[(h-1-row)*w*4+col*4+1] = 0
               output[(h-1-row)*w*4+col*4+2] = 0
               output[(h-1-row)*w*4+col*4+3] = 255
               }
            else if (i00 == 0) {
               output[(h-1-row)*w*4+col*4+0] = 0
               output[(h-1-row)*w*4+col*4+1] = 0
               output[(h-1-row)*w*4+col*4+2] = 255
               output[(h-1-row)*w*4+col*4+3] = 255
               }
            else {
               output[(h-1-row)*w*4+col*4+0] = 0
               output[(h-1-row)*w*4+col*4+1] = 255
               output[(h-1-row)*w*4+col*4+2] = 0
               output[(h-1-row)*w*4+col*4+3] = 255
               }
            }
         }
      //
      // left and right edges
      //
      for (row = 1; row < (h-1); ++row) {
         col = w-1
         i00 = (input[(h-1-row)*w*4+col*4+0] 
                   +input[(h-1-row)*w*4+col*4+1] 
                   +input[(h-1-row)*w*4+col*4+2])
         i0m = (input[(h-1-row)*w*4+(col-1)*4+0] 
                   +input[(h-1-row)*w*4+(col-1)*4+1] 
                   +input[(h-1-row)*w*4+(col-1)*4+2])
         imm = (input[(h-row)*w*4+(col-1)*4+0] 
                   +input[(h-row)*w*4+(col-1)*4+1] 
                   +input[(h-row)*w*4+(col-1)*4+2])
         ipm = (input[(h-2-row)*w*4+(col-1)*4+0] 
                   +input[(h-2-row)*w*4+(col-1)*4+1] 
                   +input[(h-2-row)*w*4+(col-1)*4+2])
         im0 = (input[(h-row)*w*4+col*4+0] 
                   +input[(h-row)*w*4+col*4+1] 
                   +input[(h-row)*w*4+col*4+2])
         ip0 = (input[(h-2-row)*w*4+col*4+0] 
                   +input[(h-2-row)*w*4+col*4+1] 
                   +input[(h-2-row)*w*4+col*4+2])
        if ((i00 != i0m) || (i00 != ip0) || (i00 != ipm) 
           || (i00 != im0) || (i00 != imm)) {
           output[(h-1-row)*w*4+col*4+0] = 255
           output[(h-1-row)*w*4+col*4+1] = 0
           output[(h-1-row)*w*4+col*4+2] = 0
           output[(h-1-row)*w*4+col*4+3] = 255
           }
        else if (i00 == 0) {
           output[(h-1-row)*w*4+col*4+0] = 0
           output[(h-1-row)*w*4+col*4+1] = 0
           output[(h-1-row)*w*4+col*4+2] = 255
           output[(h-1-row)*w*4+col*4+3] = 255
           }
        else {
           output[(h-1-row)*w*4+col*4+0] = 0
           output[(h-1-row)*w*4+col*4+1] = 255
           output[(h-1-row)*w*4+col*4+2] = 0
           output[(h-1-row)*w*4+col*4+3] = 255
           }
         col = 0
         i00 = (input[(h-1-row)*w*4+col*4+0] 
                   +input[(h-1-row)*w*4+col*4+1] 
                   +input[(h-1-row)*w*4+col*4+2])
         i0p = (input[(h-1-row)*w*4+(col+1)*4+0] 
                   +input[(h-1-row)*w*4+(col+1)*4+1] 
                   +input[(h-1-row)*w*4+(col+1)*4+2])
         imp = (input[(h-row)*w*4+(col+1)*4+0] 
                   +input[(h-row)*w*4+(col+1)*4+1] 
                   +input[(h-row)*w*4+(col+1)*4+2])
         ipp = (input[(h-2-row)*w*4+(col+1)*4+0] 
                   +input[(h-2-row)*w*4+(col+1)*4+1] 
                   +input[(h-2-row)*w*4+(col+1)*4+2])
         im0 = (input[(h-row)*w*4+col*4+0] 
                   +input[(h-row)*w*4+col*4+1] 
                   +input[(h-row)*w*4+col*4+2])
         ip0 = (input[(h-2-row)*w*4+col*4+0] 
                   +input[(h-2-row)*w*4+col*4+1] 
                   +input[(h-2-row)*w*4+col*4+2])
        if ((i00 != i0p) || (i00 != ip0) || (i00 != ipp) 
           || (i00 != im0) || (i00 != imp)) {
           output[(h-1-row)*w*4+col*4+0] = 255
           output[(h-1-row)*w*4+col*4+1] = 0
           output[(h-1-row)*w*4+col*4+2] = 0
           output[(h-1-row)*w*4+col*4+3] = 255
           }
        else if (i00 == 0) {
           output[(h-1-row)*w*4+col*4+0] = 0
           output[(h-1-row)*w*4+col*4+1] = 0
           output[(h-1-row)*w*4+col*4+2] = 255
           output[(h-1-row)*w*4+col*4+3] = 255
           }
        else {
           output[(h-1-row)*w*4+col*4+0] = 0
           output[(h-1-row)*w*4+col*4+1] = 255
           output[(h-1-row)*w*4+col*4+2] = 0
           output[(h-1-row)*w*4+col*4+3] = 255
           }
         }
      //
      // top and bottom edges
      //
      for (col = 1; col < (w-1); ++col) {
         row = h-1
         i00 = (input[(h-1-row)*w*4+col*4+0] 
                   +input[(h-1-row)*w*4+col*4+1] 
                   +input[(h-1-row)*w*4+col*4+2])
         i0m = (input[(h-1-row)*w*4+(col-1)*4+0] 
                   +input[(h-1-row)*w*4+(col-1)*4+1] 
                   +input[(h-1-row)*w*4+(col-1)*4+2])
         i0p = (input[(h-1-row)*w*4+(col+1)*4+0] 
                   +input[(h-1-row)*w*4+(col+1)*4+1] 
                   +input[(h-1-row)*w*4+(col+1)*4+2])
         imm = (input[(h-row)*w*4+(col-1)*4+0] 
                   +input[(h-row)*w*4+(col-1)*4+1] 
                   +input[(h-row)*w*4+(col-1)*4+2])
         im0 = (input[(h-row)*w*4+col*4+0] 
                   +input[(h-row)*w*4+col*4+1] 
                   +input[(h-row)*w*4+col*4+2])
         imp = (input[(h-row)*w*4+(col+1)*4+0] 
                   +input[(h-row)*w*4+(col+1)*4+1] 
                   +input[(h-row)*w*4+(col+1)*4+2])
        if ((i00 != i0m) || (i00 != i0p) || (i00 != imm) 
           || (i00 != im0) || (i00 != imp)) {
           output[(h-1-row)*w*4+col*4+0] = 255
           output[(h-1-row)*w*4+col*4+1] = 0
           output[(h-1-row)*w*4+col*4+2] = 0
           output[(h-1-row)*w*4+col*4+3] = 255
           }
        else if (i00 == 0) {
           output[(h-1-row)*w*4+col*4+0] = 0
           output[(h-1-row)*w*4+col*4+1] = 0
           output[(h-1-row)*w*4+col*4+2] = 255
           output[(h-1-row)*w*4+col*4+3] = 255
           }
        else {
           output[(h-1-row)*w*4+col*4+0] = 0
           output[(h-1-row)*w*4+col*4+1] = 255
           output[(h-1-row)*w*4+col*4+2] = 0
           output[(h-1-row)*w*4+col*4+3] = 255
           }
         row = 0
         i00 = (input[(h-1-row)*w*4+col*4+0] 
                   +input[(h-1-row)*w*4+col*4+1] 
                   +input[(h-1-row)*w*4+col*4+2])
         i0m = (input[(h-1-row)*w*4+(col-1)*4+0] 
                   +input[(h-1-row)*w*4+(col-1)*4+1] 
                   +input[(h-1-row)*w*4+(col-1)*4+2])
         i0p = (input[(h-1-row)*w*4+(col+1)*4+0] 
                   +input[(h-1-row)*w*4+(col+1)*4+1] 
                   +input[(h-1-row)*w*4+(col+1)*4+2])
         ipm = (input[(h-2-row)*w*4+(col-1)*4+0] 
                   +input[(h-2-row)*w*4+(col-1)*4+1] 
                   +input[(h-2-row)*w*4+(col-1)*4+2])
         ip0 = (input[(h-2-row)*w*4+col*4+0] 
                   +input[(h-2-row)*w*4+col*4+1] 
                   +input[(h-2-row)*w*4+col*4+2])
         ipp = (input[(h-2-row)*w*4+(col+1)*4+0] 
                   +input[(h-2-row)*w*4+(col+1)*4+1] 
                   +input[(h-2-row)*w*4+(col+1)*4+2])
        if ((i00 != i0m) || (i00 != i0p) || (i00 != ipm) 
           || (i00 != ip0) || (i00 != ipp)) {
           output[(h-1-row)*w*4+col*4+0] = 255
           output[(h-1-row)*w*4+col*4+1] = 0
           output[(h-1-row)*w*4+col*4+2] = 0
           output[(h-1-row)*w*4+col*4+3] = 255
           }
        else if (i00 == 0) {
           output[(h-1-row)*w*4+col*4+0] = 0
           output[(h-1-row)*w*4+col*4+1] = 0
           output[(h-1-row)*w*4+col*4+2] = 255
           output[(h-1-row)*w*4+col*4+3] = 255
           }
        else {
           output[(h-1-row)*w*4+col*4+0] = 0
           output[(h-1-row)*w*4+col*4+1] = 255
           output[(h-1-row)*w*4+col*4+2] = 0
           output[(h-1-row)*w*4+col*4+3] = 255
           }
         }
      //
      // corners
      //
      row = 0
      col = 0
      i00 = (input[(h-1-row)*w*4+col*4+0] 
                +input[(h-1-row)*w*4+col*4+1] 
                +input[(h-1-row)*w*4+col*4+2])
      i0p = (input[(h-1-row)*w*4+(col+1)*4+0] 
                +input[(h-1-row)*w*4+(col+1)*4+1] 
                +input[(h-1-row)*w*4+(col+1)*4+2])
      ip0 = (input[(h-2-row)*w*4+col*4+0] 
                +input[(h-2-row)*w*4+col*4+1] 
                +input[(h-2-row)*w*4+col*4+2])
      ipp = (input[(h-2-row)*w*4+(col+1)*4+0] 
                +input[(h-2-row)*w*4+(col+1)*4+1] 
                +input[(h-2-row)*w*4+(col+1)*4+2])
      if ((i00 != i0p) || (i00 != ip0) || (i00 != ipp)) {
         output[(h-1-row)*w*4+col*4+0] = 255
         output[(h-1-row)*w*4+col*4+1] = 0
         output[(h-1-row)*w*4+col*4+2] = 0
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      else if (i00 == 0) {
         output[(h-1-row)*w*4+col*4+0] = 0
         output[(h-1-row)*w*4+col*4+1] = 0
         output[(h-1-row)*w*4+col*4+2] = 255
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      else {
         output[(h-1-row)*w*4+col*4+0] = 0
         output[(h-1-row)*w*4+col*4+1] = 255
         output[(h-1-row)*w*4+col*4+2] = 0
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      row = 0
      col = w-1
      i00 = (input[(h-1-row)*w*4+col*4+0] 
                +input[(h-1-row)*w*4+col*4+1] 
                +input[(h-1-row)*w*4+col*4+2])
      i0m = (input[(h-1-row)*w*4+(col-1)*4+0] 
                +input[(h-1-row)*w*4+(col-1)*4+1] 
                +input[(h-1-row)*w*4+(col-1)*4+2])
      ip0 = (input[(h-2-row)*w*4+col*4+0] 
                +input[(h-2-row)*w*4+col*4+1] 
                +input[(h-2-row)*w*4+col*4+2])
      ipm = (input[(h-2-row)*w*4+(col-1)*4+0] 
                +input[(h-2-row)*w*4+(col-1)*4+1] 
                +input[(h-2-row)*w*4+(col-1)*4+2])
      if ((i00 != i0m) || (i00 != ip0) || (i00 != ipm)) {
         output[(h-1-row)*w*4+col*4+0] = 255
         output[(h-1-row)*w*4+col*4+1] = 0
         output[(h-1-row)*w*4+col*4+2] = 0
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      else if (i00 == 0) {
         output[(h-1-row)*w*4+col*4+0] = 0
         output[(h-1-row)*w*4+col*4+1] = 0
         output[(h-1-row)*w*4+col*4+2] = 255
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      else {
         output[(h-1-row)*w*4+col*4+0] = 0
         output[(h-1-row)*w*4+col*4+1] = 255
         output[(h-1-row)*w*4+col*4+2] = 0
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      row = h-1
      col = 0
      i00 = (input[(h-1-row)*w*4+col*4+0] 
                +input[(h-1-row)*w*4+col*4+1] 
                +input[(h-1-row)*w*4+col*4+2])
      i0p = (input[(h-1-row)*w*4+(col+1)*4+0] 
                +input[(h-1-row)*w*4+(col+1)*4+1] 
                +input[(h-1-row)*w*4+(col+1)*4+2])
      im0 = (input[(h-row)*w*4+col*4+0] 
                +input[(h-row)*w*4+col*4+1] 
                +input[(h-row)*w*4+col*4+2])
      imp = (input[(h-row)*w*4+(col+1)*4+0] 
                +input[(h-row)*w*4+(col+1)*4+1] 
                +input[(h-row)*w*4+(col+1)*4+2])
      if ((i00 != i0p) || (i00 != im0) || (i00 != imp)) {
         output[(h-1-row)*w*4+col*4+0] = 255
         output[(h-1-row)*w*4+col*4+1] = 0
         output[(h-1-row)*w*4+col*4+2] = 0
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      else if (i00 == 0) {
         output[(h-1-row)*w*4+col*4+0] = 0
         output[(h-1-row)*w*4+col*4+1] = 0
         output[(h-1-row)*w*4+col*4+2] = 255
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      else {
         output[(h-1-row)*w*4+col*4+0] = 0
         output[(h-1-row)*w*4+col*4+1] = 255
         output[(h-1-row)*w*4+col*4+2] = 0
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      row = h-1
      col = w-1
      i00 = (input[(h-1-row)*w*4+col*4+0] 
                +input[(h-1-row)*w*4+col*4+1] 
                +input[(h-1-row)*w*4+col*4+2])
      i0m = (input[(h-1-row)*w*4+(col-1)*4+0] 
                +input[(h-1-row)*w*4+(col-1)*4+1] 
                +input[(h-1-row)*w*4+(col-1)*4+2])
      im0 = (input[(h-row)*w*4+col*4+0] 
                +input[(h-row)*w*4+col*4+1] 
                +input[(h-row)*w*4+col*4+2])
      imm = (input[(h-row)*w*4+(col-1)*4+0] 
                +input[(h-row)*w*4+(col-1)*4+1] 
                +input[(h-row)*w*4+(col-1)*4+2])
      if ((i00 != i0m) || (i00 != im0) || (i00 != imm)) {
         output[(h-1-row)*w*4+col*4+0] = 255
         output[(h-1-row)*w*4+col*4+1] = 0
         output[(h-1-row)*w*4+col*4+2] = 0
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      else if (i00 == 0) {
         output[(h-1-row)*w*4+col*4+0] = 0
         output[(h-1-row)*w*4+col*4+1] = 0
         output[(h-1-row)*w*4+col*4+2] = 255
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      else {
         output[(h-1-row)*w*4+col*4+0] = 0
         output[(h-1-row)*w*4+col*4+1] = 255
         output[(h-1-row)*w*4+col*4+2] = 0
         output[(h-1-row)*w*4+col*4+3] = 255
         }
      self.postMessage({buffer:output.buffer},[output.buffer])
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

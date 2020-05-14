//
// Automatic dogbones for preprocessing images to be machined
//
// Sam Calisch
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
var name = 'dogbone'
//
// initialization
//
var init = function() {
   mod.diameter.value = ''
   }
//
// inputs
//
var inputs = {
   distances:{type:'F32',
      event:function(evt){
         mod.distances = evt.detail
         var h = mod.distances.height
         var w = mod.distances.width
         var ctx = mod.img.getContext("2d")
         ctx.canvas.height = mod.distances.height 
         ctx.canvas.width = mod.distances.width
         if (mod.diameter.value != '')
            dogbone()
         }},
   diameter:{type:'number',
      event:function(evt){
         mod.diameter.value = evt.detail
         if (mod.distances != undefined)
            dogbone()
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
   // diameter value
   //
   div.appendChild(document.createTextNode('diameter (pixels): '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         dogbone()
         })
      div.appendChild(input)
      mod.diameter = input
   //
   // view button
   //
   div.appendChild(document.createElement('br'))
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
// dogbone
//
function dogbone() {
   var blob = new Blob(['('+worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   var webworker = new Worker(url)
   webworker.addEventListener('message',function(evt) {
      window.URL.revokeObjectURL(url)
      var h = mod.distances.height
      var w = mod.distances.width
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
   var diameter = parseFloat(mod.diameter.value)
   webworker.postMessage({
      height:mod.distances.height,width:mod.distances.width,
      diameter:diameter,buffer:mod.distances.buffer})
   }
//
// dogbone worker
//
function worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var diameter = evt.data.diameter
      var input = new Float32Array(evt.data.buffer)
      var output = new Uint8ClampedArray(4*h*w)
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            if (input[(h-1-row)*w+col] <= 0) {
               output[(h-1-row)*w*4+col*4+0] = 255
               output[(h-1-row)*w*4+col*4+1] = 255
               output[(h-1-row)*w*4+col*4+2] = 255
               output[(h-1-row)*w*4+col*4+3] = 255
               }
            else {
               output[(h-1-row)*w*4+col*4+0] = 0
               output[(h-1-row)*w*4+col*4+1] = 0
               output[(h-1-row)*w*4+col*4+2] = 0
               output[(h-1-row)*w*4+col*4+3] = 255
               }
            }
         }

      //pick out ridge points at the right distance
      var distance_value = (diameter/2.) * (Math.sqrt(2)/2.);
      var distance_tol = 1; //Math.sqrt(2)/2. ;
      var r = Math.round(diameter/2);
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            var max_ud = input[ (h-1-row)*w+col ] >= Math.max(input[ (h-1-row)*w+col-1], input[ (h-1-row)*w+col+1]);  //up down
            var max_lr = input[ (h-1-row)*w+col ] >= Math.max(input[ (h-1-row-1)*w+col], input[ (h-1-row+1)*w+col]); //left right
            var max_ru = input[ (h-1-row)*w+col ] >= Math.max(input[ (h-1-row-1)*w+col+1], input[ (h-1-row+1)*w+col-1]); //right up
            var max_rd = input[ (h-1-row)*w+col ] >= Math.max(input[ (h-1-row-1)*w+col-1], input[ (h-1-row+1)*w+col+1]); //right up
            //if we are local max in at least two directions
            if( (max_ud+max_lr+max_ru+max_rd) >= 2 && Math.abs(input[ (h-1-row)*w+col]-distance_value) <= distance_tol ) {
               for(var cx=-r; cx<=r; ++cx){
                  var yx = Math.ceil(Math.sqrt(r*r-cx*cx));
                  for(var cy=-yx; cy<=yx; ++cy){
                     output[(h-1-(row+cx))*w*4+(col+cy)*4+0] = 0;
                     output[(h-1-(row+cx))*w*4+(col+cy)*4+1] = 0;
                     output[(h-1-(row+cx))*w*4+(col+cy)*4+2] = 0;
                     output[(h-1-(row+cx))*w*4+(col+cy)*4+3] = 255;
                  }
               }

            }     
         }
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

//
// distance transform 
//    assumes thresholded image, with zero intensity exterior
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
var name = 'distance transform'
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
         distance_transform()}}}
//
// outputs
//
var outputs = {
   distances:{type:'F32',
      event:function(){
         mod.distances.height = mod.input.height
         mod.distances.width = mod.input.width
         mods.output(mod,'distances',mod.distances)}}}
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
// distance transform function
//
function distance_transform() {
   var blob = new Blob(['('+worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   var webworker = new Worker(url)
   webworker.addEventListener('message',function(evt) {
      window.URL.revokeObjectURL(url)
      var h = mod.img.height
      var w = mod.img.width
      mod.distances = new Float32Array(evt.data.buffer)
      var imgbuf = new Uint8ClampedArray(h*w*4)
      var dmax = -Number.MAX_VALUE
      for (var y = 0; y < h; ++y) {
         for (var x = 0; x < w; ++x) {
            if (mod.distances[(h-1-y)*w+x] > dmax)
               dmax = mod.distances[(h-1-y)*w+x]
            }
         }
      var i
      for (var y = 0; y < h; ++y) {
         for (var x = 0; x < w; ++x) {
            i = 255*mod.distances[(h-1-y)*w+x]/dmax
            imgbuf[(h-1-y)*w*4+x*4+0] = i
            imgbuf[(h-1-y)*w*4+x*4+1] = i
            imgbuf[(h-1-y)*w*4+x*4+2] = i
            imgbuf[(h-1-y)*w*4+x*4+3] = 255
            }
         }
      var imgdata = new ImageData(imgbuf,w,h)
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
      outputs.distances.event()
      })
   var ctx = mod.canvas.getContext("2d")
   ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
   var ctx = mod.img.getContext("2d")
   ctx.putImageData(mod.input,0,0)
   var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
   webworker.postMessage({
      height:mod.input.height,width:mod.input.width,
      buffer:img.data.buffer},
      [img.data.buffer])
   }
//
// distance transform worker
//
function worker() {
   self.addEventListener('message',function(evt) {
      var ny = evt.data.height
      var nx = evt.data.width
      var input = new Uint8ClampedArray(evt.data.buffer)
      var output = new Float32Array(nx*ny)
      function distance(g,x,y,i) {
         return ((y-i)*(y-i)+g[i][x]*g[i][x])
         }
      function intersection(g,x,y0,y1) {
         return ((g[y0][x]*g[y0][x]-g[y1][x]*g[y1][x]+y0*y0-y1*y1)/(2.0*(y0-y1)))
         }
      //
      // allocate arrays
      //
      var g = []
      for (var y = 0; y < ny; ++y)
         g[y] = new Uint32Array(nx)
      var h = []
      for (var y = 0; y < ny; ++y)
         h[y] = new Uint32Array(nx)
      var distances = []
      for (var y = 0; y < ny; ++y)
         distances[y] = new Uint32Array(nx)
      var starts = new Uint32Array(ny)
      var minimums = new Uint32Array(ny)
      var d
      //
      // column scan
      //  
      for (var y = 0; y < ny; ++y) {
         //
         // right pass
         //
         var closest = -nx
         for (var x = 0; x < nx; ++x) {
            if (input[(ny-1-y)*nx*4+x*4+0] != 0) {
               g[y][x] = 0
               closest = x
               }
            else
               g[y][x] = (x-closest)
            }
         //
         // left pass
         //
         closest = 2*nx
         for (var x = (nx-1); x >= 0; --x) {
            if (input[(ny-1-y)*nx*4+x*4+0] != 0)
               closest = x
            else {
               d = (closest-x)
               if (d < g[y][x])
                  g[y][x] = d
               }
            }
         }
      //
      // row scan
      //
      for (var x = 0; x < nx; ++x) {
         var segment = 0
         starts[0] = 0
         minimums[0] = 0
         //
         // down 
         //
         for (var y = 1; y < ny; ++y) {
            while ((segment >= 0) &&
               (distance(g,x,starts[segment],minimums[segment]) > distance(g,x,starts[segment],y)))
               segment -= 1
            if (segment < 0) {
               segment = 0
               minimums[0] = y
               }
            else {
               newstart = 1+intersection(g,x,minimums[segment],y)
               if (newstart < ny) {
                  segment += 1
                  minimums[segment] = y
                  starts[segment] = newstart
                  }
               }
            }
         //
         // up 
         //
         for (var y = (ny-1); y >= 0; --y) {
            d = Math.sqrt(distance(g,x,y,minimums[segment]))
            output[(ny-1-y)*nx+x] = d
            if (y == starts[segment])
               segment -= 1
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

//
// mesh slice raster
// 
// todo
//    include slice plane triangles
//    scale perturbation to resolution
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
var name = 'mesh slice raster'
//
// initialization
//
var init = function() {
   mod.mmunits.value = 25.4
   mod.inunits.value = 1
   mod.depth.value = 0.1
   mod.width.value = 1000
   mod.border.value = 0
   mod.delta = 1e-6
   }
//
// inputs
//
var inputs = {
   mesh:{type:'STL',
      event:function(evt){
         mod.mesh = new DataView(evt.detail)
         find_limits_slice()}},
   settings:{type:'',
      event:function(evt){
         for (var p in evt.detail)
            if (p == 'depthmm') {
               mod.depth.value = evt.detail[p]
                  /parseFloat(mod.mmunits.value)
               }
         find_limits_slice()}}}
//
// outputs
//
var outputs = {
   image:{type:'RGBA',
      event:function(){
         var ctx = mod.img.getContext("2d")
         var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
         mods.output(mod,'image',img)
         }},
   imageInfo:{type:'',
      event:function(){
         var obj = {}
         obj.name = "mesh slice raster"
         obj.width = mod.img.width
         obj.height = mod.img.height
         obj.dpi = mod.img.width/(mod.dx*parseFloat(mod.inunits.value))
         mods.output(mod,'imageInfo',obj)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // on-screen slice canvas
   //
   div.appendChild(document.createTextNode(' '))
   var canvas = document.createElement('canvas')
      canvas.width = mods.ui.canvas
      canvas.height = mods.ui.canvas
      canvas.style.backgroundColor = 'rgb(255,255,255)'
      div.appendChild(canvas)
      mod.slicecanvas = canvas
   div.appendChild(document.createElement('br'))
   //
   // off-screen image canvas
   //
   var canvas = document.createElement('canvas')
      mod.img = canvas
   //
   // mesh units
   //
   div.appendChild(document.createTextNode('mesh units: (enter)'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('mm: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         mod.inunits.value = parseFloat(mod.mmunits.value)/25.4
         find_limits_slice()
         })
      div.appendChild(input)
      mod.mmunits = input
   div.appendChild(document.createTextNode(' in: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         mod.mmunits.value = parseFloat(mod.inunits.value)*25.4
         find_limits_slice()
         })
      div.appendChild(input)
      mod.inunits = input
   //
   // mesh size
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('mesh size:'))
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('XxYxZ (units)')
      div.appendChild(text)
      mod.meshsize = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('XxYxZ (mm)')
      div.appendChild(text)
      mod.mmsize = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('XxYxZ (in)')
      div.appendChild(text)
      mod.insize = text
   //
   // slice depth
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('slice Z depth: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         find_limits_slice()
         })
      div.appendChild(input)
      mod.depth = input
   div.appendChild(document.createTextNode(' (units)'))
   //
   // slice border 
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('slice border: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         find_limits_slice()
         })
      div.appendChild(input)
      mod.border = input
   div.appendChild(document.createTextNode(' (units)'))
   //
   // slice width
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('slice width: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         find_limits_slice()
         })
      div.appendChild(input)
      mod.width = input
   div.appendChild(document.createTextNode(' (pixels)'))
   //
   // view slice
   //
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('view slice'))
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
// find limits then slice
//
function find_limits_slice() {
   var blob = new Blob(['('+limits_worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   var webworker = new Worker(url)
   webworker.addEventListener('message',function(evt) {
      window.URL.revokeObjectURL(url)
      mod.triangles = evt.data.triangles
      mod.xmin = evt.data.xmin
      mod.xmax = evt.data.xmax
      mod.ymin = evt.data.ymin
      mod.ymax = evt.data.ymax
      mod.zmin = evt.data.zmin
      mod.zmax = evt.data.zmax
      mod.dx = mod.xmax-mod.xmin
      mod.dy = mod.ymax-mod.ymin
      mod.dz = mod.zmax-mod.zmin
      mod.meshsize.nodeValue = 
         mod.dx.toFixed(3)+' x '+
         mod.dy.toFixed(3)+' x '+
         mod.dz.toFixed(3)+' (units)'
      var mm = parseFloat(mod.mmunits.value)
      mod.mmsize.nodeValue = 
         (mod.dx*mm).toFixed(3)+' x '+
         (mod.dy*mm).toFixed(3)+' x '+
         (mod.dz*mm).toFixed(3)+' (mm)'
      var inches = parseFloat(mod.inunits.value)
      mod.insize.nodeValue = 
         (mod.dx*inches).toFixed(3)+' x '+
         (mod.dy*inches).toFixed(3)+' x '+
         (mod.dz*inches).toFixed(3)+' (in)'
      mods.fit(mod.div)
      slice_mesh()
      })
   var border = parseFloat(mod.border.value)
   webworker.postMessage({
      mesh:mod.mesh,
      border:border,delta:mod.delta})
   }
function limits_worker() {
   self.addEventListener('message',function(evt) {
      var view = evt.data.mesh
      var depth = evt.data.depth
      var border = evt.data.border
      var delta = evt.data.delta // perturb to remove degeneracies
      //
      // get vars
      //
      var endian = true
      var triangles = view.getUint32(80,endian)
      var size = 80+4+triangles*(4*12+2)
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
         x0 = view.getFloat32(offset,endian)+delta
         offset += 4
         y0 = view.getFloat32(offset,endian)+delta
         offset += 4
         z0 = view.getFloat32(offset,endian)+delta
         offset += 4
         x1 = view.getFloat32(offset,endian)+delta
         offset += 4
         y1 = view.getFloat32(offset,endian)+delta
         offset += 4
         z1 = view.getFloat32(offset,endian)+delta
         offset += 4
         x2 = view.getFloat32(offset,endian)+delta
         offset += 4
         y2 = view.getFloat32(offset,endian)+delta
         offset += 4
         z2 = view.getFloat32(offset,endian)+delta
         offset += 4
         offset += 2
         if (x0 > xmax) xmax = x0
         if (x0 < xmin) xmin = x0
         if (y0 > ymax) ymax = y0
         if (y0 < ymin) ymin = y0
         if (z0 > zmax) zmax = z0
         if (z0 < zmin) zmin = z0
         if (x1 > xmax) xmax = x1
         if (x1 < xmin) xmin = x1
         if (y1 > ymax) ymax = y1
         if (y1 < ymin) ymin = y1
         if (z1 > zmax) zmax = z1
         if (z1 < zmin) zmin = z1
         if (x2 > xmax) xmax = x2
         if (x2 < xmin) xmin = x2
         if (y2 > ymax) ymax = y2
         if (y2 < ymin) ymin = y2
         if (z2 > zmax) zmax = z2
         if (z2 < zmin) zmin = z2
         }
      xmin -= border
      xmax += border
      ymin -= border
      ymax += border
      //
      // return
      //
      self.postMessage({triangles:triangles,
         xmin:xmin,xmax:xmax,ymin:ymin,ymax:ymax,
         zmin:zmin,zmax:zmax})
      self.close()
      })
   }
//
// slice mesh
//   
function slice_mesh() {
   var blob = new Blob(['('+slice_worker.toString()+'())'])
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
         var y0 = mod.slicecanvas.height*.5*(1-h/w)
         var wd = mod.slicecanvas.width
         var hd = mod.slicecanvas.width*h/w
         }
      else {
         var x0 = mod.slicecanvas.width*.5*(1-w/h)
         var y0 = 0
         var wd = mod.slicecanvas.height*w/h
         var hd = mod.slicecanvas.height
         }
      var ctx = mod.slicecanvas.getContext("2d")
      ctx.clearRect(0,0,mod.slicecanvas.width,mod.slicecanvas.height)
      ctx.drawImage(mod.img,x0,y0,wd,hd)
      outputs.image.event()
      outputs.imageInfo.event()
      })
   var ctx = mod.slicecanvas.getContext("2d")
   ctx.clearRect(0,0,mod.slicecanvas.width,mod.slicecanvas.height)
   var depth = parseFloat(mod.depth.value)
   mod.img.width = parseInt(mod.width.value)
   mod.img.height = Math.round(mod.img.width*mod.dy/mod.dx)
   var ctx = mod.img.getContext("2d")
   var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
   webworker.postMessage({
      height:mod.img.height,width:mod.img.width,depth:depth,
      imgbuffer:img.data.buffer,mesh:mod.mesh,
      xmin:mod.xmin,xmax:mod.xmax,
      ymin:mod.ymin,ymax:mod.ymax,
      zmin:mod.zmin,zmax:mod.zmax,
      delta:mod.delta},
      [img.data.buffer])
   }
function slice_worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var depth = evt.data.depth
      var view = evt.data.mesh
      var delta = evt.data.delta // perturb to remove degeneracies
      var xmin = evt.data.xmin
      var xmax = evt.data.xmax
      var ymin = evt.data.ymin
      var ymax = evt.data.ymax
      var zmin = evt.data.zmin
      var zmax = evt.data.zmax
      var buf = new Uint8ClampedArray(evt.data.imgbuffer)
      //
      // get vars from buffer
      //
      var endian = true
      var triangles = view.getUint32(80,endian)
      var size = 80+4+triangles*(4*12+2)
      //
      // initialize slice image
      //
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            buf[(h-1-row)*w*4+col*4+0] = 0
            buf[(h-1-row)*w*4+col*4+1] = 0
            buf[(h-1-row)*w*4+col*4+2] = 0
            buf[(h-1-row)*w*4+col*4+3] = 255
            }
         }
      //
      // find triangles crossing the slice
      //
      var segs = []
      offset = 80+4
      for (var t = 0; t < triangles; ++t) {
         offset += 3*4
         x0 = view.getFloat32(offset,endian)+delta
         offset += 4
         y0 = view.getFloat32(offset,endian)+delta
         offset += 4
         z0 = view.getFloat32(offset,endian)+delta
         offset += 4
         x1 = view.getFloat32(offset,endian)+delta
         offset += 4
         y1 = view.getFloat32(offset,endian)+delta
         offset += 4
         z1 = view.getFloat32(offset,endian)+delta
         offset += 4
         x2 = view.getFloat32(offset,endian)+delta
         offset += 4
         y2 = view.getFloat32(offset,endian)+delta
         offset += 4
         z2 = view.getFloat32(offset,endian)+delta
         offset += 4
         //
         // assemble vertices
         //
         offset += 2
         var v = [[x0,y0,z0],[x1,y1,z1],[x2,y2,z2]]
         //
         // sort z
         //
         v.sort(function(a,b) {
            if (a[2] < b[2])
               return -1
            else if (a[2] > b[2])
               return 1
            else
               return 0
            })
         //
         // check for crossings
         //
         if ((v[0][2] < (zmax-depth)) && (v[2][2] > (zmax-depth))) {
            //
            //  crossing found, check for side and save
            //
            if (v[1][2] < (zmax-depth)) {
               var x0 = v[2][0]+(v[0][0]-v[2][0])
                  *(v[2][2]-(zmax-depth))/(v[2][2]-v[0][2])
               var y0 = v[2][1]+(v[0][1]-v[2][1])
                  *(v[2][2]-(zmax-depth))/(v[2][2]-v[0][2])
               var x1 = v[2][0]+(v[1][0]-v[2][0])
                  *(v[2][2]-(zmax-depth))/(v[2][2]-v[1][2])
               var y1 = v[2][1]+(v[1][1]-v[2][1])
                  *(v[2][2]-(zmax-depth))/(v[2][2]-v[1][2])
               }
            else if (v[1][2] >= (zmax-depth)) {
               var x0 = v[2][0]+(v[0][0]-v[2][0])
                  *(v[2][2]-(zmax-depth))/(v[2][2]-v[0][2])
               var y0 = v[2][1]+(v[0][1]-v[2][1])
                  *(v[2][2]-(zmax-depth))/(v[2][2]-v[0][2])
               var x1 = v[1][0]+(v[0][0]-v[1][0])
                  *(v[1][2]-(zmax-depth))/(v[1][2]-v[0][2])
               var y1 = v[1][1]+(v[0][1]-v[1][1])
                  *(v[1][2]-(zmax-depth))/(v[1][2]-v[0][2])
               }
            if (y0 < y1)
               segs.push({x0:x0,y0:y0,x1:x1,y1:y1})
            else
               segs.push({x0:x1,y0:y1,x1:x0,y1:y0})
            }
         }
      //
      // fill interior
      //
      for (var row = 0; row < h; ++row) {
         var y = ymin+(ymax-ymin)*row/(h-1)
         rowsegs = segs.filter(p => ((p.y0 <= y) && (p.y1 >= y)))
         var xs = rowsegs.map(p =>
            (p.x0+(p.x1-p.x0)*(y-p.y0)/(p.y1-p.y0)))
         xs.sort((a,b) => (a-b))
         for (var col = 0; col < w; ++col) {
            var x = xmin+(xmax-xmin)*col/(w-1)
            var index = xs.findIndex((p) => (p >= x))
            if (index == -1)
               var i = 0
            else
               var i = 255*(index%2)
            buf[(h-1-row)*w*4+col*4+0] = i
            buf[(h-1-row)*w*4+col*4+1] = i
            buf[(h-1-row)*w*4+col*4+2] = i
            buf[(h-1-row)*w*4+col*4+3] = 255
            }
         }
      //
      // output the slice
      //
      self.postMessage({buffer:buf.buffer},[buf.buffer])
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

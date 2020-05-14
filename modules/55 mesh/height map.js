//
// mesh height map
// 
// Neil Gershenfeld 1/16/20
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
var name = 'mesh height map'
//
// initialization
//
var init = function() {
   mod.mmunits.value = '25.4'
   mod.inunits.value = '1'
   mod.width.value = '1000'
   mod.border.value = '0'
   }
//
// inputs
//
var inputs = {
   mesh:{type:'STL',
      event:function(evt){
         mod.mesh = new DataView(evt.detail)
         find_limits_map()}}}
//
// outputs
//
var outputs = {
   map:{type:'',label:'height map',
      event:function(heightmap){
         var obj = {}
         obj.map = heightmap
         obj.xmin = mod.xmin
         obj.xmax = mod.xmax
         obj.ymin = mod.ymin
         obj.ymax = mod.ymax
         obj.zmin = mod.zmin
         obj.zmax = mod.zmax
         obj.width = mod.img.width
         obj.height = mod.img.height
         obj.mmunits = mod.mmunits.value
         mods.output(mod,'map',obj)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // on-screen height map canvas
   //
   div.appendChild(document.createTextNode(' '))
   var canvas = document.createElement('canvas')
      canvas.width = mods.ui.canvas
      canvas.height = mods.ui.canvas
      canvas.style.backgroundColor = 'rgb(255,255,255)'
      div.appendChild(canvas)
      mod.mapcanvas = canvas
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
         find_limits_map()
         })
      div.appendChild(input)
      mod.mmunits = input
   div.appendChild(document.createTextNode(' in: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         mod.mmunits.value = parseFloat(mod.inunits.value)*25.4
         find_limits_map()
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
   // height map border 
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('border: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         find_limits_map()
         })
      div.appendChild(input)
      mod.border = input
   div.appendChild(document.createTextNode(' (units)'))
   //
   // height map width
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('width: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         find_limits_map()
         })
      div.appendChild(input)
      mod.width = input
   div.appendChild(document.createTextNode(' (pixels)'))
   //
   // view height map
   //
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('view height map'))
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
// find limits then map 
//
function find_limits_map() {
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
      map_mesh()
      })
   var border = parseFloat(mod.border.value)
   webworker.postMessage({
      mesh:mod.mesh,
      border:border})
   }
function limits_worker() {
   self.addEventListener('message',function(evt) {
      var view = evt.data.mesh
      var border = evt.data.border
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
         x0 = view.getFloat32(offset,endian)
         offset += 4
         y0 = view.getFloat32(offset,endian)
         offset += 4
         z0 = view.getFloat32(offset,endian)
         offset += 4
         x1 = view.getFloat32(offset,endian)
         offset += 4
         y1 = view.getFloat32(offset,endian)
         offset += 4
         z1 = view.getFloat32(offset,endian)
         offset += 4
         x2 = view.getFloat32(offset,endian)
         offset += 4
         y2 = view.getFloat32(offset,endian)
         offset += 4
         z2 = view.getFloat32(offset,endian)
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
// map mesh
//   
function map_mesh() {
   var blob = new Blob(['('+map_worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   var webworker = new Worker(url)
   webworker.addEventListener('message',function(evt) {
      window.URL.revokeObjectURL(url)
      var h = mod.img.height
      var w = mod.img.width
      var buf = new Uint8ClampedArray(evt.data.imgbuffer)
      var map = new Float32Array(evt.data.mapbuffer)
      var imgdata = new ImageData(buf,w,h)
      var ctx = mod.img.getContext("2d")
      ctx.putImageData(imgdata,0,0)
      if (w > h) {
         var x0 = 0
         var y0 = mod.mapcanvas.height*.5*(1-h/w)
         var wd = mod.mapcanvas.width
         var hd = mod.mapcanvas.width*h/w
         }
      else {
         var x0 = mod.mapcanvas.width*.5*(1-w/h)
         var y0 = 0
         var wd = mod.mapcanvas.height*w/h
         var hd = mod.mapcanvas.height
         }
      var ctx = mod.mapcanvas.getContext("2d")
      ctx.clearRect(0,0,mod.mapcanvas.width,mod.mapcanvas.height)
      ctx.drawImage(mod.img,x0,y0,wd,hd)
      outputs.map.event(map)
      })
   var ctx = mod.mapcanvas.getContext("2d")
   ctx.clearRect(0,0,mod.mapcanvas.width,mod.mapcanvas.height)
   mod.img.width = parseInt(mod.width.value)
   mod.img.height = Math.round(mod.img.width*mod.dy/mod.dx)
   var ctx = mod.img.getContext("2d")
   var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
   var map = new Float32Array(mod.img.width*mod.img.height)
   webworker.postMessage({
      height:mod.img.height,width:mod.img.width,
      imgbuffer:img.data.buffer,
      mapbuffer:map.buffer,
      mesh:mod.mesh,
      xmin:mod.xmin,xmax:mod.xmax,
      ymin:mod.ymin,ymax:mod.ymax,
      zmin:mod.zmin,zmax:mod.zmax},
      [img.data.buffer,map.buffer])
   }
function map_worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var view = evt.data.mesh
      var xmin = evt.data.xmin
      var xmax = evt.data.xmax
      var ymin = evt.data.ymin
      var ymax = evt.data.ymax
      var zmin = evt.data.zmin
      var zmax = evt.data.zmax
      var buf = new Uint8ClampedArray(evt.data.imgbuffer)
      var map = new Float32Array(evt.data.mapbuffer)
      //
      // get vars from buffer
      //
      var endian = true
      var triangles = view.getUint32(80,endian)
      var size = 80+4+triangles*(4*12+2)
      //
      // initialize map and image
      //
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            map[(h-1-row)*w+col] = zmin
            buf[(h-1-row)*w*4+col*4+0] = 0
            buf[(h-1-row)*w*4+col*4+1] = 0
            buf[(h-1-row)*w*4+col*4+2] = 0
            buf[(h-1-row)*w*4+col*4+3] = 255
            }
         }
      //
      // loop over triangles
      //
      var segs = []
      offset = 80+4
      for (var t = 0; t < triangles; ++t) {
         offset += 3*4
         x0 = view.getFloat32(offset,endian)
         offset += 4
         y0 = view.getFloat32(offset,endian)
         offset += 4
         z0 = view.getFloat32(offset,endian)
         offset += 4
         x1 = view.getFloat32(offset,endian)
         offset += 4
         y1 = view.getFloat32(offset,endian)
         offset += 4
         z1 = view.getFloat32(offset,endian)
         offset += 4
         x2 = view.getFloat32(offset,endian)
         offset += 4
         y2 = view.getFloat32(offset,endian)
         offset += 4
         z2 = view.getFloat32(offset,endian)
         offset += 4
         offset += 2
         //
         // check normal if needs to be drawn
         //
         if (((x1-x0)*(y1-y2)-(x1-x2)*(y1-y0)) >= 0)
            continue
         //
         // quantize image coordinates
         //
         x0 = Math.floor((w-1)*(x0-xmin)/(xmax-xmin))
         x1 = Math.floor((w-1)*(x1-xmin)/(xmax-xmin))
         x2 = Math.floor((w-1)*(x2-xmin)/(xmax-xmin))
         y0 = Math.floor((h-1)*(y0-ymin)/(ymax-ymin))
         y1 = Math.floor((h-1)*(y1-ymin)/(ymax-ymin))
         y2 = Math.floor((h-1)*(y2-ymin)/(ymax-ymin))
         //
         // sort projection order
         //
         if (y1 > y2) {
            var temp = x1;
            x1 = x2;
            x2 = temp
            var temp = y1;
            y1 = y2;
            y2 = temp
            var temp = z1;
            z1 = z2;
            z2 = temp
            }
         if (y0 > y1) {
            var temp = x0;
            x0 = x1;
            x1 = temp
            var temp = y0;
            y0 = y1;
            y1 = temp
            var temp = z0;
            z0 = z1;
            z1 = temp
            }
         if (y1 > y2) {
            var temp = x1;
            x1 = x2;
            x2 = temp
            var temp = y1;
            y1 = y2;
            y2 = temp
            var temp = z1;
            z1 = z2;
            z2 = temp
            }
         //
         // check orientation after sort
         //
         if (x1 < (x0+((x2-x0)*(y1-y0))/(y2-y0)))
            var dir = 1;
         else
            var dir = -1;
         //
         // set z values
         //
         if (y2 != y1) {
            for (var y = y1; y <= y2; ++y) {
               x12 = Math.floor(0.5+x1+(y-y1)*(x2-x1)/(y2-y1))
               z12 = z1+(y-y1)*(z2-z1)/(y2-y1)
               x02 = Math.floor(0.5+x0+(y-y0)*(x2-x0)/(y2-y0))
               z02 = z0+(y-y0)*(z2-z0)/(y2-y0)
               if (x12 != x02)
                  var slope = (z02-z12)/(x02-x12)
               else
                  var slope = 0
               var x = x12 - dir
               while (x != x02) {
                  x += dir
                  var z = z12+slope*(x-x12)
                  if (z > map[(h-1-y)*w+x]) {
                     map[(h-1-y)*w+x] = z
                     var iz = Math.floor(255*(z-zmin)/(zmax-zmin))
                     buf[(h-1-y)*w*4+x*4+0] = iz
                     buf[(h-1-y)*w*4+x*4+1] = iz
                     buf[(h-1-y)*w*4+x*4+2] = iz
                     }
                  }
               }
            }
         if (y1 != y0) {
            for (var y = y0; y <= y1; ++y) {
               x01 = Math.floor(0.5+x0+(y-y0)*(x1-x0)/(y1-y0))
               z01 = z0+(y-y0)*(z1-z0)/(y1-y0)
               x02 = Math.floor(0.5+x0+(y-y0)*(x2-x0)/(y2-y0))
               z02 = z0+(y-y0)*(z2-z0)/(y2-y0)
               if (x01 != x02)
                  var slope = (z02-z01)/(x02-x01)
               else
                  var slope = 0
               var x = x01 - dir
               while (x != x02) {
                  x += dir
                  var z = z01+slope*(x-x01)
                  if (z > map[(h-1-y)*w+x]) {
                     map[(h-1-y)*w+x] = z
                     var iz = Math.floor(255*(z-zmin)/(zmax-zmin))
                     buf[(h-1-y)*w*4+x*4+0] = iz
                     buf[(h-1-y)*w*4+x*4+1] = iz
                     buf[(h-1-y)*w*4+x*4+2] = iz
                     }
                  }
               }
            }
         }
      //
      // output the map
      //
      self.postMessage({imgbuffer:buf.buffer,mapbuffer:map.buffer},[buf.buffer,map.buffer])
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

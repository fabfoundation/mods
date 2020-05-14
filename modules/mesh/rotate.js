//
// mesh rotate
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
var name = 'mesh rotate'
//
// initialization
//
var init = function() {
   mod.rx.value = 0
   mod.ry.value = 0
   mod.rz.value = 0
   }
//
// inputs
//
var inputs = {
   mesh:{type:'STL',
      event:function(evt){
         mod.mesh = evt.detail
         rotate_mesh()}}}
//
// outputs
//
var outputs = {
   mesh:{type:'STL',
      event:function(buffer){
         mods.output(mod,'mesh',buffer)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // canvas
   //
   var canvas = document.createElement('canvas')
      canvas.width = mods.ui.canvas
      canvas.height = mods.ui.canvas
      canvas.style.backgroundColor = 'rgb(255,255,255)'
      div.appendChild(canvas)
      mod.canvas = canvas
   div.appendChild(document.createElement('br'))
   //
   // rotation
   //
   div.appendChild(document.createTextNode('rotation (degrees):'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode(' x: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         rotate_mesh()
         })
      div.appendChild(input)
      mod.rx = input
   div.appendChild(document.createTextNode(' y: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         rotate_mesh()
         })
      div.appendChild(input)
      mod.ry = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode(' z: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         rotate_mesh()
         })
      div.appendChild(input)
      mod.rz = input
   div.appendChild(document.createTextNode(' (enter)'))
   div.appendChild(document.createElement('br'))
   //
   // info
   //
   var text = document.createTextNode('dx:')
      div.appendChild(text)
      mod.dxn = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('dy:')
      div.appendChild(text)
      mod.dyn = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('dz:')
      div.appendChild(text)
      mod.dzn = text
   div.appendChild(document.createElement('br'))
   }
//
// local functions
//
// rotate mesh
//
function rotate_mesh() {
   //
   // check for binary STL
   //
   var endian = true
   var view = new DataView(mod.mesh)
   var triangles = view.getUint32(80,endian)
   var size = 80+4+triangles*(4*12+2)
   //
   // find limits, rotate, and draw
   //
   var blob = new Blob(['('+rotate_mesh_worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   var webworker = new Worker(url)
   webworker.addEventListener('message',function(evt) {
      //
      // worker response
      //
      window.URL.revokeObjectURL(url)
      //
      // size
      //
      mod.dxn.nodeValue = 'dx: '+evt.data.dx.toFixed(3)
      mod.dyn.nodeValue = 'dy: '+evt.data.dy.toFixed(3)
      mod.dzn.nodeValue = 'dz: '+evt.data.dz.toFixed(3)
      //
      // image
      //
      var image = evt.data.image
      var height = mod.canvas.height
      var width = mod.canvas.width
      var buffer = new Uint8ClampedArray(evt.data.image)
      var imgdata = new ImageData(buffer,width,height)
      var ctx = mod.canvas.getContext("2d")
      ctx.putImageData(imgdata,0,0)
      //
      // mesh
      //
      mod.mesh = evt.data.mesh
      //
      // output
      //
      outputs.mesh.event(evt.data.rotate)
      })
   //
   // call worker
   //
   var ctx = mod.canvas.getContext("2d")
   ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
   var img = ctx.getImageData(0,0,mod.canvas.width,mod.canvas.height)
   var rx = parseFloat(mod.rx.value)*Math.PI/180
   var ry = parseFloat(mod.ry.value)*Math.PI/180
   var rz = parseFloat(mod.rz.value)*Math.PI/180
   webworker.postMessage({
      height:mod.canvas.height,width:mod.canvas.width,
      rx:rx,ry:ry,rz:rz,
      image:img.data.buffer,mesh:mod.mesh},
      [img.data.buffer,mod.mesh])
   }
function rotate_mesh_worker() {
   self.addEventListener('message',function(evt) {
      //
      // function to draw line
      //
      function line(x0,y0,x1,y1) {
         var ix0 = Math.floor(xo+xw*(x0-xmin)/dx)
         var iy0 = Math.floor(yo+yh*(ymax-y0)/dy)
         var ix1 = Math.floor(xo+xw*(x1-xmin)/dx)
         var iy1 = Math.floor(yo+yh*(ymax-y1)/dy)
         var row,col
         var idx = ix1-ix0
         var idy = iy1-iy0
         if (Math.abs(idy) > Math.abs(idx)) {
            (idy > 0) ?
               (row0=iy0,col0=ix0,row1=iy1,col1=ix1):
               (row0=iy1,col0=ix1,row1=iy0,col1=ix0)
            for (row = row0; row <= row1; ++row) {
               col = Math.floor(col0+(col1-col0)*(row-row0)/(row1-row0))
               image[row*width*4+col*4+0] = 0
               image[row*width*4+col*4+1] = 0
               image[row*width*4+col*4+2] = 0
               image[row*width*4+col*4+3] = 255
               }
            }
         else if ((Math.abs(idx) >= Math.abs(idy)) && (idx != 0)) {
            (idx > 0) ?
               (row0=iy0,col0=ix0,row1=iy1,col1=ix1):
               (row0=iy1,col0=ix1,row1=iy0,col1=ix0)
            for (col = col0; col <= col1; ++col) {
               row = Math.floor(row0+(row1-row0)*(col-col0)/(col1-col0))
               image[row*width*4+col*4+0] = 0
               image[row*width*4+col*4+1] = 0
               image[row*width*4+col*4+2] = 0
               image[row*width*4+col*4+3] = 255
               }
            }
         else {
            row = iy0
            col = ix0
            image[row*width*4+col*4+0] = 0
            image[row*width*4+col*4+1] = 0
            image[row*width*4+col*4+2] = 0
            image[row*width*4+col*4+3] = 255
            }
         }
      //
      // function to rotate point
      //
      function rotate(x,y,z) {
         var x1 = x
         var y1 = Math.cos(rx)*y-Math.sin(rx)*z
         var z1 = Math.sin(rx)*y+Math.cos(rx)*z
         var x2 = Math.cos(ry)*x1-Math.sin(ry)*z1
         var y2 = y1
         var z2 = Math.sin(ry)*x1+Math.cos(ry)*z1
         var x3 = Math.cos(rz)*x2-Math.sin(rz)*y2
         var y3 = Math.sin(rz)*x2+Math.cos(rz)*y2
         var z3 = z2
         //return([x3,y3,z3])
         return({x:x3,y:y3,z:z3})
         }
      //
      // get variables
      //
      var height = evt.data.height
      var width = evt.data.width
      var rx = evt.data.rx
      var ry = evt.data.ry
      var rz = evt.data.rz
      var endian = true
      var image = new Uint8ClampedArray(evt.data.image)
      var view = new DataView(evt.data.mesh)
      var triangles = view.getUint32(80,endian)
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
         var p0 = rotate(x0,y0,z0)
         if (p0.x > xmax) xmax = p0.x
         if (p0.x < xmin) xmin = p0.x
         if (p0.y > ymax) ymax = p0.y
         if (p0.y < ymin) ymin = p0.y
         if (p0.z > zmax) zmax = p0.z
         if (p0.z < zmin) zmin = p0.z
         var p1 = rotate(x1,y1,z1)
         if (p1.x > xmax) xmax = p1.x
         if (p1.x < xmin) xmin = p1.x
         if (p1.y > ymax) ymax = p1.y
         if (p1.y < ymin) ymin = p1.y
         if (p1.z > zmax) zmax = p1.z
         if (p1.z < zmin) zmin = p1.z
         var p2 = rotate(x2,y2,z2)
         if (p2.x > xmax) xmax = p2.x
         if (p2.x < xmin) xmin = p2.x
         if (p2.y > ymax) ymax = p2.y
         if (p2.y < ymin) ymin = p2.y
         if (p2.z > zmax) zmax = p2.z
         if (p2.z < zmin) zmin = p2.z
         }
      var dx = xmax-xmin
      var dy = ymax-ymin
      var dz = zmax-zmin
      //
      // copy mesh
      //
      var newbuf = evt.data.mesh.slice(0)
      var newview = new DataView(newbuf)
      //
      // copy and draw mesh
      //
      if (dx > dy) {
         var xo = 0
         var yo = height*.5*(1-dy/dx)
         var xw = (width-1)
         var yh = (width-1)*dy/dx
         }
      else {
         var xo = width*.5*(1-dx/dy)
         var yo = 0
         var xw = (height-1)*dx/dy
         var yh = (height-1)
         }
      offset = 80+4
      var newoffset = 80+4
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
         var p0 = rotate(x0,y0,z0)
         var p1 = rotate(x1,y1,z1)
         var p2 = rotate(x2,y2,z2)
         line(p0.x,p0.y,p1.x,p1.y)
         line(p1.x,p1.y,p2.x,p2.y)
         line(p2.x,p2.y,p0.x,p0.y)
         newoffset += 3*4
         newview.setFloat32(newoffset,p0.x,endian)
         newoffset += 4
         newview.setFloat32(newoffset,p0.y,endian)
         newoffset += 4
         newview.setFloat32(newoffset,p0.z,endian)
         newoffset += 4
         newview.setFloat32(newoffset,p1.x,endian)
         newoffset += 4
         newview.setFloat32(newoffset,p1.y,endian)
         newoffset += 4
         newview.setFloat32(newoffset,p1.z,endian)
         newoffset += 4
         newview.setFloat32(newoffset,p2.x,endian)
         newoffset += 4
         newview.setFloat32(newoffset,p2.y,endian)
         newoffset += 4
         newview.setFloat32(newoffset,p2.z,endian)
         newoffset += 4
         newoffset += 2
         }
      //
      // return results and close
      //
      self.postMessage({
         dx:dx,dy:dy,dz:dz,
         image:evt.data.image,mesh:evt.data.mesh,rotate:newbuf},
         [evt.data.image,evt.data.mesh,newbuf])
      self.close()
      })
   }
function old_rotate_mesh() {
   //
   // function to rotate point
   //
   function rotate(x,y,z) {
      var x1 = x
      var y1 = Math.cos(rx)*y-Math.sin(rx)*z
      var z1 = Math.sin(rx)*y+Math.cos(rx)*z
      var x2 = Math.cos(ry)*x1-Math.sin(ry)*z1
      var y2 = y1
      var z2 = Math.sin(ry)*x1+Math.cos(ry)*z1
      var x3 = Math.cos(rz)*x2-Math.sin(rz)*y2
      var y3 = Math.sin(rz)*x2+Math.cos(rz)*y2
      var z3 = z2
      return([x3,y3,z3])
      }
   //
   // get vars
   //
   var view = mod.mesh
   var endian = true
   var triangles = view.getUint32(80,endian)
   mod.triangles = triangles
   var size = 80+4+triangles*(4*12+2)
   var rx = parseFloat(mod.rx.value)*Math.PI/180
   var ry = parseFloat(mod.ry.value)*Math.PI/180
   var rz = parseFloat(mod.rz.value)*Math.PI/180
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
      var p0 = rotate(x0,y0,z0)
      if (p0[0] > xmax) xmax = p0[0]
      if (p0[0] < xmin) xmin = p0[0]
      if (p0[1] > ymax) ymax = p0[1]
      if (p0[1] < ymin) ymin = p0[1]
      if (p0[2] > zmax) zmax = p0[2]
      if (p0[2] < zmin) zmin = p0[2]
      var p1 = rotate(x1,y1,z1)
      if (p1[0] > xmax) xmax = p1[0]
      if (p1[0] < xmin) xmin = p1[0]
      if (p1[1] > ymax) ymax = p1[1]
      if (p1[1] < ymin) ymin = p1[1]
      if (p1[2] > zmax) zmax = p1[2]
      if (p1[2] < zmin) zmin = p1[2]
      var p2 = rotate(x2,y2,z2)
      if (p2[0] > xmax) xmax = p2[0]
      if (p2[0] < xmin) xmin = p2[0]
      if (p2[1] > ymax) ymax = p2[1]
      if (p2[1] < ymin) ymin = p2[1]
      if (p2[2] > zmax) zmax = p2[2]
      if (p2[2] < zmin) zmin = p2[2]
      }
   mod.dx = xmax-xmin
   mod.dy = ymax-ymin
   mod.dz = zmax-zmin
   mod.dxn.nodeValue = 'dx: '+mod.dx.toFixed(3)
   mod.dyn.nodeValue = 'dy: '+mod.dy.toFixed(3)
   mod.dzn.nodeValue = 'dz: '+mod.dz.toFixed(3)
   mod.xmin = xmin
   mod.ymin = ymin
   mod.zmin = zmin
   mod.xmax = xmax
   mod.ymax = ymax
   mod.zmax = zmax
   //
   // copy mesh
   //
   var buf = mod.mesh.buffer.slice(0)
   var newview = new DataView(buf)
   //
   // draw projection and save rotation
   //
   var ctx = mod.meshcanvas.getContext('2d')
   var w = mod.meshcanvas.width
   var h = mod.meshcanvas.height
   ctx.clearRect(0,0,w,h)
   var dx = mod.dx
   var dy = mod.dy
   if (dx > dy) {
      var xo = 0
      var yo = h*.5*(1-dy/dx)
      var xw = w
      var yh = w*dy/dx
      }
   else {
      var xo = w*.5*(1-dx/dy)
      var yo = 0
      var xw = h*dx/dy
      var yh = h
      }
   ctx.beginPath()
   offset = 80+4
   var newoffset = 80+4
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
      var p0 = rotate(x0,y0,z0)
      var p1 = rotate(x1,y1,z1)
      var p2 = rotate(x2,y2,z2)
      x0 = xo+xw*(p0[0]-xmin)/dx
      y0 = yo+yh*(ymax-p0[1])/dy
      x1 = xo+xw*(p1[0]-xmin)/dx
      y1 = yo+yh*(ymax-p1[1])/dy
      x2 = xo+xw*(p2[0]-xmin)/dx
      y2 = yo+yh*(ymax-p2[1])/dy
      ctx.moveTo(x0,y0)
      ctx.lineTo(x1,y1)
      ctx.lineTo(x2,y2)
      ctx.lineTo(x0,y0)
      newoffset += 3*4
      newview.setFloat32(newoffset,p0[0],endian)
      newoffset += 4
      newview.setFloat32(newoffset,p0[1],endian)
      newoffset += 4
      newview.setFloat32(newoffset,p0[2],endian)
      newoffset += 4
      newview.setFloat32(newoffset,p1[0],endian)
      newoffset += 4
      newview.setFloat32(newoffset,p1[1],endian)
      newoffset += 4
      newview.setFloat32(newoffset,p1[2],endian)
      newoffset += 4
      newview.setFloat32(newoffset,p2[0],endian)
      newoffset += 4
      newview.setFloat32(newoffset,p2[1],endian)
      newoffset += 4
      newview.setFloat32(newoffset,p2[2],endian)
      newoffset += 4
      newoffset += 2
      }
   ctx.stroke()
   //
   // generate output
   //
   outputs.mesh.event(buf)
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

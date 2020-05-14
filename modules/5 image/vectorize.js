//
// vectorize
//    input is red 128:north,64:south, green 128:east,64:west, blue 128:start,64:stop
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
var name = 'vectorize'
//
// initialization
//
var init = function() {
   mod.error.value = 1
   mod.sort.checked = true
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
         vectorize()
         }}}
//
// outputs
//
var outputs = {
   path:{type:'array',
      event:function(){
         mods.output(mod,'path',mod.path)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // on-screen SVG
   //
   var svgNS = "http://www.w3.org/2000/svg"
   var svg = document.createElementNS(svgNS,"svg")
   svg.setAttribute('id',mod.div.id+'svg')
   svg.setAttributeNS("http://www.w3.org/2000/xmlns/",
      "xmlns:xlink","http://www.w3.org/1999/xlink")
   svg.setAttribute('width',mods.ui.canvas)
   svg.setAttribute('height',mods.ui.canvas)
   svg.style.backgroundColor = 'rgb(255,255,255)'
   var g = document.createElementNS(svgNS,'g')
   g.setAttribute('id',mod.div.id+'g')
   svg.appendChild(g)
   div.appendChild(svg)
   div.appendChild(document.createElement('br'))   
   //
   // off-screen image canvas
   //
   var canvas = document.createElement('canvas')
      mod.img = canvas
   //
   // error value
   //
   div.appendChild(document.createTextNode('vector fit (pixels): '))
   //div.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         vectorize()
         })
      div.appendChild(input)
      mod.error = input
   div.appendChild(document.createElement('br'))
   //
   // sort
   //
   div.appendChild(document.createTextNode('sort distance: '))
   var input = document.createElement('input')
      input.type = 'checkbox'
      input.id = mod.div.id+'sort'
      div.appendChild(input)
      mod.sort = input
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
         var svg = document.getElementById(mod.div.id+'svg')
         var clone = svg.cloneNode(true)
         clone.setAttribute('width',mod.img.width)
         clone.setAttribute('height',mod.img.height)
         win.document.body.appendChild(clone)
         })
      div.appendChild(btn)
   }
//
// local functions
//
// vectorize
//
function vectorize() {
   //
   // draw path
   //
   function draw_path(path) {
      window.URL.revokeObjectURL(url)
      var svg = document.getElementById(mod.div.id+'svg')
      svg.setAttribute('viewBox',"0 0 "+(mod.img.width-1)+" "+(mod.img.height-1))
      var g = document.getElementById(mod.div.id+'g')
      svg.removeChild(g)
      var g = document.createElementNS('http://www.w3.org/2000/svg','g')
      g.setAttribute('id',mod.div.id+'g')
      var h = mod.img.height
      var w = mod.img.width
      var xend = null
      var yend = null
      //
      // loop over segments
      //
      for (var segment in path) {
         if (path[segment].length > 1) {
            if (xend != null) {
               //
               // draw connection from previous segment
               //
               var line = document.createElementNS('http://www.w3.org/2000/svg','line')
               line.setAttribute('stroke','red')
               line.setAttribute('stroke-width',1)
               line.setAttribute('stroke-linecap','round')
               var x1 = xend
               var y1 = yend
               var x2 = path[segment][0][0]
               var y2 = h-path[segment][0][1]-1
               line.setAttribute('x1',x1)
               line.setAttribute('y1',y1)
               line.setAttribute('x2',x2)
               line.setAttribute('y2',y2)
               var dx = x2-x1
               var dy = y2-y1
               var d = Math.sqrt(dx*dx+dy*dy)
               if (d > 0) {
                  nx = 6*dx/d
                  ny = 6*dy/d
                  var tx = 3*dy/d
                  var ty = -3*dx/d
                  g.appendChild(line)
                  triangle = document.createElementNS('http://www.w3.org/2000/svg','polygon')
                  triangle.setAttribute('points',x2+','+y2+' '+(x2-nx+tx)+','+(y2-ny+ty)
                     +' '+(x2-nx-tx)+','+(y2-ny-ty))
                  triangle.setAttribute('fill','red')
                  g.appendChild(triangle)
                  }
               }
            //
            // loop over points
            //
            for (var point = 1; point < path[segment].length; ++point) {
               var line = document.createElementNS('http://www.w3.org/2000/svg','line')
               line.setAttribute('stroke','black')
               line.setAttribute('stroke-width',1)
               line.setAttribute('stroke-linecap','round')
               var x1 = path[segment][point-1][0]
               var y1 = h-path[segment][point-1][1]-1
               var x2 = path[segment][point][0]
               var y2 = h-path[segment][point][1]-1
               xend = x2
               yend = y2
               line.setAttribute('x1',x1)
               line.setAttribute('y1',y1)
               line.setAttribute('x2',x2)
               line.setAttribute('y2',y2)
               var dx = x2-x1
               var dy = y2-y1
               var d = Math.sqrt(dx*dx+dy*dy)
               if (d > 0) {
                  nx = 6*dx/d
                  ny = 6*dy/d
                  var tx = 3*dy/d
                  var ty = -3*dx/d
                  g.appendChild(line)
                  triangle = document.createElementNS('http://www.w3.org/2000/svg','polygon')
                  triangle.setAttribute('points',x2+','+y2+' '+(x2-nx+tx)+','+(y2-ny+ty)
                     +' '+(x2-nx-tx)+','+(y2-ny-ty))
                  triangle.setAttribute('fill','black')
                  g.appendChild(triangle)
                  }
               }
            }
         }
      svg.appendChild(g)
      }
   //
   // set up worker
   //
   var blob = new Blob(['('+worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   var webworker = new Worker(url)
   webworker.addEventListener('message',function(evt) {
      window.URL.revokeObjectURL(url)
      webworker.terminate()
      mod.path = evt.data.path
      draw_path(mod.path)
      outputs.path.event()
      })
   //
   // call worker
   //
   webworker.postMessage({
      height:mod.input.height,width:mod.input.width,sort:mod.sort.checked,
      error:parseFloat(mod.error.value),
      buffer:mod.input.data.buffer})
   }
//
// vectorize worker
//
function worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var sort = evt.data.sort
      var input = new Uint8ClampedArray(evt.data.buffer)
      var northsouth = 0
      var north = 128
      var south = 64
      var eastwest = 1
      var east = 128
      var west = 64
      var startstop = 2
      var start = 128
      var stop = 64
      var path = []
      //
      // edge follower
      //
      function follow_edges(row,col) {
         if ((input[(h-1-row)*w*4+col*4+northsouth] != 0)
            || (input[(h-1-row)*w*4+col*4+eastwest] != 0)) {
            path[path.length] = [[col,row]]
            while (1) {
               if (input[(h-1-row)*w*4+col*4+northsouth] & north) {
                  input[(h-1-row)*w*4+col*4+northsouth] =
                     input[(h-1-row)*w*4+col*4+northsouth] & ~north
                  row += 1
                  path[path.length-1][path[path.length-1].length] = [col,row]
                  }
               else if (input[(h-1-row)*w*4+col*4+northsouth] & south) {
                  input[(h-1-row)*w*4+col*4+northsouth] =
                     input[(h-1-row)*w*4+col*4+northsouth] & ~south
                  row -= 1
                  path[path.length-1][path[path.length-1].length] = [col,row]
                  }
               else if (input[(h-1-row)*w*4+col*4+eastwest] & east) {
                  input[(h-1-row)*w*4+col*4+eastwest] =
                     input[(h-1-row)*w*4+col*4+eastwest] & ~east
                  col += 1
                  path[path.length-1][path[path.length-1].length] = [col,row]
                  }
               else if (input[(h-1-row)*w*4+col*4+eastwest] & west) {
                  input[(h-1-row)*w*4+col*4+eastwest] =
                     input[(h-1-row)*w*4+col*4+eastwest] & ~west
                  col -= 1
                  path[path.length-1][path[path.length-1].length] = [col,row]
                  }
               else
                  break
               }
            }
         }
      //
      // follow boundary starts
      //
      for (var row = 1; row < (h-1); ++row) {
         col = 0
         follow_edges(row,col)
         col = w-1
         follow_edges(row,col)
         }
      for (var col = 1; col < (w-1); ++col) {
         row = 0
         follow_edges(row,col)
         row = h-1      
         follow_edges(row,col)
         }
      //
      // follow interior paths
      //
      for (var row = 1; row < (h-1); ++row) {
         for (var col = 1; col < (w-1); ++col) {
            follow_edges(row,col)
            }
         }
      //
      // vectorize path
      //
      var error = evt.data.error
      var vecpath = []
      for (var seg = 0; seg < path.length; ++seg) {
         var x0 = path[seg][0][0]
         var y0 = path[seg][0][1]
         vecpath[vecpath.length] = [[x0,y0]]
         var xsum = x0
         var ysum = y0
         var sum = 1
         for (var pt = 1; pt < path[seg].length; ++pt) {
            var xold = x
            var yold = y
            var x = path[seg][pt][0]
            var y = path[seg][pt][1]
            if (sum == 1) {
               xsum += x
               ysum += y
               sum += 1
               }
            else {
               var xmean = xsum/sum
               var ymean = ysum/sum
               var dx = xmean-x0
               var dy = ymean-y0
               var d = Math.sqrt(dx*dx+dy*dy)
               var nx = dy/d
               var ny = -dx/d
               var l = Math.abs(nx*(x-x0)+ny*(y-y0))
               if (l < error) {
                  xsum += x
                  ysum += y
                  sum += 1
                  }
               else {
                  vecpath[vecpath.length-1][vecpath[vecpath.length-1].length] = [xold,yold]
                  x0 = xold
                  y0 = yold
                  xsum = xold
                  ysum = yold
                  sum = 1
                  }
               }
            if (pt == (path[seg].length-1)) {
               vecpath[vecpath.length-1][vecpath[vecpath.length-1].length] = [x,y]
               }
            }
         }
      //
      // sort path
      //
      if ((vecpath.length > 1) && (sort == true)) {
         var dmin = w*w+h*h
         segmin = null
         for (var seg = 0; seg < vecpath.length; ++seg) {
            var x = vecpath[seg][0][0]
            var y = vecpath[seg][0][0]
            var d = x*x+y*y
            if (d < dmin) {
               dmin = d
               segmin = seg
               }
            }
         if (segmin != null) {
            var sortpath = [vecpath[segmin]]
            vecpath.splice(segmin,1)
            }
         while (vecpath.length > 0) {
            var dmin = w*w+h*h
            var x0 = sortpath[sortpath.length-1][sortpath[sortpath.length-1].length-1][0]
            var y0 = sortpath[sortpath.length-1][sortpath[sortpath.length-1].length-1][1]
            segmin = null
            for (var seg = 0; seg < vecpath.length; ++seg) {
               var x = vecpath[seg][0][0]
               var y = vecpath[seg][0][1]
               var d = (x-x0)*(x-x0)+(y-y0)*(y-y0)
               if (d < dmin) {
                  dmin = d
                  segmin = seg
                  }
               }
            if (segmin != null) {
               sortpath[sortpath.length] = vecpath[segmin]
               vecpath.splice(segmin,1)
               }
            }
         }
      else if (((vecpath.length > 1) && (sort == false)) || (vecpath.length == 1))
         sortpath = vecpath
      else
         sortpath = []
      //
      // return path
      //
      self.postMessage({path:sortpath})
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

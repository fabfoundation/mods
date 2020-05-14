//
// mill raster 3D
//
// Neil Gershenfeld 1/18/20
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
var name = 'mill raster 3D'
//
// initialization
//
var init = function() {
   mod.dia_in.value = 0.125
   mod.dia_mm.value = 25.4*parseFloat(mod.dia_in.value)
   mod.stepover.value = 0.5
   mod.error.value = 0.001
   }
//
// inputs
//
var inputs = {
   map:{type:'',label:'height map',
      event:function(evt){
         mod.map = evt.detail.map
         mod.xmin = evt.detail.xmin
         mod.xmax = evt.detail.xmax
         mod.ymin = evt.detail.ymin
         mod.ymax = evt.detail.ymax
         mod.zmin = evt.detail.zmin
         mod.zmax = evt.detail.zmax
         mod.width = evt.detail.width
         mod.height = evt.detail.height
         mod.depth = Math.floor((mod.zmax-mod.zmin)*mod.width/(mod.xmax-mod.xmin))
         mod.mmunits = evt.detail.mmunits
         mod.dpi = mod.width/(mod.mmunits*(mod.xmax-mod.xmin)/25.4)
         var ctx = mod.img.getContext("2d")
         ctx.canvas.width = mod.width
         ctx.canvas.height = mod.height
         }}}
//
// outputs
//
var outputs = {
   toolpath:{type:'',
      event:function(){
         obj = {}
         obj.path = mod.path
         obj.name = "mill raster 3D"
         obj.dpi = mod.dpi
         obj.width = mod.width
         obj.height = mod.height
         obj.depth = mod.depth
         mods.output(mod,'toolpath',obj)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // tool diameter
   //
   div.appendChild(document.createTextNode('tool diameter'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('mm: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         mod.dia_in.value = parseFloat(mod.dia_mm.value)/25.4
         })
      div.appendChild(input)
      mod.dia_mm = input
   div.appendChild(document.createTextNode(' in: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         mod.dia_mm.value = parseFloat(mod.dia_in.value)*25.4
         })
      div.appendChild(input)
      mod.dia_in = input
   div.appendChild(document.createElement('br'))
   //
   // stepover
   //
   div.appendChild(document.createTextNode('stepover (0-1): '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.stepover = input
   div.appendChild(document.createElement('br'))
   //
   // tool shape
   //
   div.appendChild(document.createTextNode('tool shape: '))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'shape'
      input.id = mod.div.id+'flatend'
      input.checked = true
      div.appendChild(input)
      mod.flatend= input
   div.appendChild(document.createTextNode('flat end'))
   div.appendChild(document.createElement('br'))
   //
   // direction 
   //
   div.appendChild(document.createTextNode('direction: '))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'direction'
      input.id = mod.div.id+'dirx'
      input.checked = true
      div.appendChild(input)
      mod.dirx = input
   div.appendChild(document.createTextNode('xz'))
   div.appendChild(document.createElement('br'))
   //
   // fit error 
   //
   div.appendChild(document.createTextNode('vector fit: '))
   //div.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.error = input
   div.appendChild(document.createElement('br'))
   //
   // calculate
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      var span = document.createElement('span')
         var text = document.createTextNode('calculate')
            mod.label = text
            span.appendChild(text)
         mod.labelspan = span
         btn.appendChild(span)
      btn.addEventListener('click',function(){
         mod.label.nodeValue = 'calculating'
         mod.labelspan.style.fontWeight = 'bold'
         calculate_path()
         })
      div.appendChild(btn)
   div.appendChild(document.createTextNode(' '))
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
         var svg = document.getElementById(mod.div.id+'svg')
         var clone = svg.cloneNode(true)
         clone.setAttribute('width',mod.img.width)
         clone.setAttribute('height',mod.img.height)
         win.document.body.appendChild(clone)
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
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
   }
//
// local functions
//
// calculate path
//
function calculate_path() {
   var blob = new Blob(['('+calculate_path_worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   var webworker = new Worker(url)
   webworker.addEventListener('message',function(evt) {
      if (evt.data.type == "progress") {
         mod.label.nodeValue = evt.data.value
         return
         }
      //
      // webworker handler
      //
      mod.path = evt.data.path
      mod.label.nodeValue = 'calculate'
      mod.labelspan.style.fontWeight = 'normal'
      //
      // clear SVG
      //
      var svg = document.getElementById(mod.div.id+'svg')
      svg.setAttribute('viewBox',"0 0 "+(mod.width-1)+" "+(mod.height-1))
      var g = document.getElementById(mod.div.id+'g')
      svg.removeChild(g)
      var g = document.createElementNS('http://www.w3.org/2000/svg','g')
      g.setAttribute('id',mod.div.id+'g')
      svg.appendChild(g)
      //
      // plot path
      //
      for (var i = 1; i < mod.path[0].length; ++i) {
         var ixp = mod.path[0][i-1][0]
         var iyp = mod.height-1-mod.path[0][i-1][1]
         var izp = 0.1*mod.path[0][i-1][2]
         var ix = mod.path[0][i][0]
         var iy = mod.height-1-mod.path[0][i][1]
         var iz = 0.1*mod.path[0][i][2]
         var line = document.createElementNS(
               'http://www.w3.org/2000/svg','line')
            line.setAttribute('stroke','black')
            line.setAttribute('stroke-width',1)
            line.setAttribute('stroke-linecap','round')
            line.setAttribute('x1',ixp)
            line.setAttribute('y1',iyp-izp)
            line.setAttribute('x2',ix)
            line.setAttribute('y2',iy-iz)
            g.appendChild(line)
            }
      //
      // output path
      //
      outputs.toolpath.event()
      })
   //
   // call webworker
   //
   webworker.postMessage({
      height:mod.height,width:mod.width,
      error:mod.error.value,
      xmin:mod.xmin,xmax:mod.xmax,
      ymin:mod.ymin,ymax:mod.ymax,
      zmin:mod.zmin,zmax:mod.zmax,
      diameter:mod.dia_mm.value,
      stepover:mod.stepover.value,
      mmunits: mod.mmunits,
      map:mod.map})
   }
//
// calculate path worker
//
function calculate_path_worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var error = evt.data.error
      var xmin = evt.data.xmin
      var xmax = evt.data.xmax
      var ymin = evt.data.ymin
      var ymax = evt.data.ymax
      var zmin = evt.data.zmin
      var zmax = evt.data.zmax
      var map = evt.data.map
      var diameter = evt.data.diameter
      var stepover = evt.data.stepover
      var mmunits = evt.data.mmunits
      var ystep = Math.floor(stepover*diameter*w/(mmunits*(xmax-xmin)))
      var path = [[]]
      //
      // construct tool offset
      //
      var toolsize = Math.floor(diameter*w/(mmunits*(xmax-xmin)))
      var tooloffset = new Float32Array(toolsize*toolsize)
      var toolmiddle = Math.floor(toolsize/2)
      for (var x = 0; x < toolsize; ++x)
         for (var y = 0; y < toolsize; ++y) {
            var r = Math.sqrt((x-toolmiddle)*(x-toolmiddle)+(y-toolmiddle)*(y-toolmiddle))
            if (r <= toolmiddle)
               tooloffset[y*toolsize+x] = 0
            else
               tooloffset[y*toolsize+x] = Number.MAX_VALUE
            }
      //
      // loop over lines
      //
      var xstart = 0
      var ystart = h-1
      var zstart = Math.floor((map[ystart*w+xstart]-zmax)*w/(xmax-xmin))
      path[0].push([xstart,h-1-ystart,zstart])
      var xcur = 1
      var ycur = h-1
      var zcur = Math.floor((map[ycur*w+xcur]-zmax)*w/(xmax-xmin))
      var dx = 1
      var dy = 0
      while (1) {
         //
         // move to next point
         //
         xnext = xcur+dx
         ynext = ycur+dy
         if (ynext <= 0)
            //
            // done
            //
            break;
         //
         // find offset at next point
         //
         var znext = -Number.MAX_VALUE
         for (var xoffset = 0; xoffset < toolsize; ++xoffset)
            for (var yoffset = 0; yoffset < toolsize; ++yoffset) {
               var x = xnext+(xoffset-toolmiddle)
               var y = ynext+(yoffset-toolmiddle)
               var offset = tooloffset[yoffset*toolsize+xoffset]
               var z = Math.floor((map[y*w+x]-zmax)*w/(xmax-xmin))-offset
               if (z > znext)
                  znext = z
               }
         //
         // vectorize
         //
         dxcur = xcur-xstart
         dycur = ycur-ystart
         dzcur = zcur-zstart
         dcur = Math.sqrt(dxcur*dxcur+dycur*dycur+dzcur*dzcur)
         nxcur = dxcur/dcur
         nycur = dycur/dcur
         nzcur = dzcur/dcur
         dxnext = xnext-xcur
         dynext = ynext-ycur
         dznext = znext-zcur
         dnext = Math.sqrt(dxnext*dxnext+dynext*dynext+dznext*dznext)
         nxnext = dxnext/dnext
         nynext = dynext/dnext
         nznext = dznext/dnext
         dot = nxcur*nxnext+nycur*nynext+nzcur*nznext
         if (dot <= (1-error)) {
            path[0].push([xcur,h-1-ycur,zcur])
            xstart = xcur
            ystart = ycur
            zstart = zcur
            }
         xcur = xnext
         ycur = ynext
         zcur = znext
         if (xcur == (w-1)) {
            if (dx == 1) {
               dx = 0
               dy = -ystep
               }
            else {
               dx = -1
               dy = 0
               }
            }
         else if (xcur == 0) {
            if (dx == -1) {
               dx = 0
               dy = -ystep
               }
            else {
               dx = 1
               dy = 0
               }
            }
         //
         // update progress
         //
         self.postMessage({type:'progress',value:ycur})
         }
      //
      // return
      //
      self.postMessage({type:'path',path:path})
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


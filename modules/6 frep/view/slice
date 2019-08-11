//
// frep view slice
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
var name = 'frep view slice'
//
// initialization
//
var init = function() {
   mod.mmunits.value = 25.4
   mod.inunits.value = 1
   mod.depth.value = 0.1
   mod.width.value = 1000
   mod.border.value = 0
   }
//
// inputs
//
var inputs = {
   shape:{type:'frep',
      event:function(evt){
         mod.frep = evt.detail
         limits()
         slice()
         }}}
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
         obj.name = "frep view slice"
         obj.width = mod.img.width
         obj.height = mod.img.height
         obj.dpi = mod.img.width/(mod.dx*parseFloat(mod.inunits.value))
         obj.dpi = parseFloat(mod.width.value)/(mod.dx*parseFloat(mod.inunits.value))
         mods.output(mod,'imageInfo',obj)
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
   // frep units
   //
   div.appendChild(document.createTextNode('frep units: (enter)'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('mm: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         mod.inunits.value = parseFloat(mod.mmunits.value)/25.4
         limits()
         })
      div.appendChild(input)
      mod.mmunits = input
   div.appendChild(document.createTextNode(' in: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         mod.mmunits.value = parseFloat(mod.inunits.value)*25.4
         limits()
         })
      div.appendChild(input)
      mod.inunits = input
   div.appendChild(document.createElement('br'))
   //
   // frep size
   //
   div.appendChild(document.createTextNode('frep size:'))
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
   div.appendChild(document.createElement('br'))
   //
   // slice depth
   //
   div.appendChild(document.createTextNode('slice z depth: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('change',function(){
         limits()
         slice()
         })
      div.appendChild(input)
      mod.depth = input
   div.appendChild(document.createTextNode(' (units)'))
   div.appendChild(document.createElement('br'))
   //
   // slice border 
   //
   div.appendChild(document.createTextNode('slice border: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         limits()
         slice()
         })
      div.appendChild(input)
      mod.border = input
   div.appendChild(document.createTextNode(' (units)'))
   div.appendChild(document.createElement('br'))
   //
   // slice width
   //
   div.appendChild(document.createTextNode('slice width: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('change',function(){
         limits()
         slice()
         })
      div.appendChild(input)
      mod.width = input
   div.appendChild(document.createTextNode(' (pixels)'))
   div.appendChild(document.createElement('br'))
   //
   // view button
   //
   div.appendChild(document.createTextNode(' '))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('view slice'))
      btn.addEventListener('click',function(){
         mod.win = window.open('')
         mod.win.document.body.style.overflow = 'hidden'
         mod.win.document.body.style.border = 0
         mod.win.document.body.style.padding = 0
         mod.win.document.body.style.margin = 0
         mod.win.addEventListener('unload',function() {
            mod.win = null
            })
         var canvas = document.createElement('canvas')
            canvas.setAttribute('id',mod.div.id+'canvas')
            mod.win.document.body.appendChild(canvas)
         var ctx = canvas.getContext("2d")
         canvas.width = window.innerWidth
         canvas.height = window.innerWidth
         var h = mod.img.height
         var w = mod.img.width
         if (w > h) {
            var wd = canvas.width
            var hd = canvas.width*h/w
            }
         else {
            var wd = canvas.height*w/h
            var hd = canvas.height
            }
         ctx.fillStyle = '#dddddd'
         ctx.fillRect(0,0,canvas.width,canvas.height)
         ctx.drawImage(mod.img,0,0,wd,hd)
         })
      div.appendChild(btn)
   }
//
// local functions
//
// limits
//
function limits() {
   var limits = mod.frep.limits
   var ins = parseFloat(mod.inunits.value)
   var mms = parseFloat(mod.mmunits.value)
   var border = parseFloat(mod.border.value)
   mod.dx = 2*border+limits[0][1]-limits[0][0]
   mod.dy = 2*border+limits[1][1]-limits[1][0]
   if (mod.frep.variables.length == 2) {
      mod.meshsize.nodeValue =
         (mod.dx).toFixed(3)+' x '+
         (mod.dy).toFixed(3)+' (units)'
      mod.mmsize.nodeValue =
         (mms*mod.dx).toFixed(3)+' x '+
         (mms*mod.dy).toFixed(3)+' (mm)'
      mod.insize.nodeValue = 
         (ins*mod.dx).toFixed(3)+' x '+
         (ins*mod.dy).toFixed(3)+' (in)'
      }
   else if (mod.frep.variables.length > 2) {
      mod.dz = limits[2][1]-limits[2][0]
      mod.meshsize.nodeValue =
         (mod.dx).toFixed(3)+' x '+
         (mod.dy).toFixed(3)+' x '+
         (mod.dz).toFixed(3)+' (units)'
      mod.mmsize.nodeValue =
         (mms*mod.dx).toFixed(3)+' x '+
         (mms*mod.dy).toFixed(3)+' x '+
         (mms*mod.dz).toFixed(3)+' (mm)'
      mod.insize.nodeValue = 
         (ins*mod.dx).toFixed(3)+' x '+
         (ins*mod.dy).toFixed(3)+' x '+
         (ins*mod.dz).toFixed(3)+' (in)'
      }
   outputs.imageInfo.event()
   mods.fit(mod.div)
   }
//
// slice
//
function slice() {   
   var fn = mod.frep.function
   var vars = mod.frep.variables
   var limits = mod.frep.limits
   var type = mod.frep.type
   var depth = parseFloat(mod.depth.value)
   var border = parseFloat(mod.border.value)
   var xvar = vars[0]
   var xlimits = limits[0]
   var yvar = vars[1]
   var ylimits = limits[1]
   if (vars.length == 2) {
      var zvar = ''
      var zlimits = []
      }
   else if (vars.length == 3) {
      var zvar = vars[2]
      var zlimits = limits[2]
      }
   var w = parseInt(mod.width.value)
   var h = Math.floor(w*(ylimits[1]-ylimits[0])/(xlimits[1]-xlimits[0]))
   mod.img.height = h
   mod.img.width = w
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
      ctx.fillStyle = '#dddddd'
      ctx.fillRect(0,0,mod.canvas.width,mod.canvas.height)
      ctx.drawImage(mod.img,x0,y0,wd,hd)
      if (mod.win != null) {
         var canvas = mod.win.document.getElementById(mod.div.id+'canvas')
         var ctx = canvas.getContext("2d")
         canvas.width = window.innerWidth
         canvas.height = window.innerWidth
         var h = mod.img.height
         var w = mod.img.width
         if (w > h) {
            var wd = canvas.width
            var hd = canvas.width*h/w
            }
         else {
            var wd = canvas.height*w/h
            var hd = canvas.height
            }
         ctx.fillStyle = '#dddddd'
         ctx.fillRect(0,0,canvas.width,canvas.height)
         ctx.drawImage(mod.img,0,0,wd,hd)
         }
      webworker.terminate()
      outputs.image.event()
      })
   var ctx = mod.canvas.getContext("2d")
   ctx.fillStyle = '#dddddd'
   ctx.fillRect(0,0,mod.canvas.width,mod.canvas.height)
   var ctx = mod.img.getContext("2d")
   ctx.fillStyle = '#dddddd'
   ctx.fillRect(0,0,mod.img.width,mod.img.height)
   var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
   webworker.postMessage({
      height:img.height,width:img.width,
      xvar:xvar,yvar:yvar,zvar:zvar,
      xlimits:xlimits,ylimits:ylimits,zlimits:zlimits,
      depth:depth,border:border,function:fn,
      buffer:img.data.buffer},
      [img.data.buffer])
   }
//
// worker
//
function worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var xvar = evt.data.xvar
      var yvar = evt.data.yvar
      var zvar = evt.data.zvar
      var xlimits = evt.data.xlimits
      var ylimits = evt.data.ylimits
      var zlimits = evt.data.zlimits
      var depth = evt.data.depth
      var border = evt.data.border
      xlimits[0] -= border
      xlimits[1] += border
      ylimits[0] -= border
      ylimits[1] += border
      var zval = depth
      var buf = new Uint8ClampedArray(evt.data.buffer)
      var f = new Function(xvar,yvar,zvar,'return ('+evt.data.function+')')
      var x,y,v
      for (var row = 0; row < h; ++row) {
         y = ylimits[0]+(ylimits[1]-ylimits[0])*row/(h-1)
         for (var col = 0; col < w; ++col) {
            x = xlimits[0]+(xlimits[1]-xlimits[0])*col/(w-1)
            v = (f(x,y,zval) >= 0) ? 255 : 0
            buf[(h-1-row)*w*4+col*4+0] = v
            buf[(h-1-row)*w*4+col*4+1] = v
            buf[(h-1-row)*w*4+col*4+2] = v
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

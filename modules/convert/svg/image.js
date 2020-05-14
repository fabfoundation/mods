//
// convert SVG image
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
var name = 'convert SVG image'
//
// initialization
//
var init = function() {
   mod.dpi.value = 100
   }
//
// inputs
//
var inputs = {
   SVG:{type:'string',
      event:function(evt){
         mod.svg = evt.detail
         get_size()
         load_image()}}}
//
// outputs
//
var outputs = {
   image:{type:'RGBA',
      event:function(){
         var ctx = mod.img.getContext("2d")
         var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
         mods.output(mod,'image',img)}},
   imageInfo:{type:'object',
      event:function(){
         var obj = {}
         obj.name = "SVG image"
         obj.dpi = parseFloat(mod.dpi.value)
         obj.width = mod.img.width
         obj.height = mod.img.height
         mods.output(mod,'imageInfo',obj)}}}
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
         var canvas = document.createElement('canvas')
            canvas.width = mod.img.width
            canvas.height = mod.img.height
            win.document.body.appendChild(canvas)
         var ctx = canvas.getContext("2d")
            ctx.drawImage(mod.img,0,0)
         })
      div.appendChild(btn)
   //
   // invert button
   //
   div.appendChild(document.createTextNode(' '))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('invert'))
      btn.addEventListener('click',function(){
         invert_image()
         })
      div.appendChild(btn)
   //
   // dpi
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('dpi: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         load_image()
         })
      div.appendChild(input)
      mod.dpi = input
   div.appendChild(document.createTextNode(' (enter)'))
   //
   // units
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('units: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         load_image()
         })
      div.appendChild(input)
      mod.unitstext = input
   div.appendChild(document.createTextNode(' (enter)'))
   //
   // fill
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('fill background: '))
   var input = document.createElement('input')
      input.type = 'checkbox'
      input.checked = true
      input.id = mod.div.id+'fill'
      div.appendChild(input)
      mod.fill= input
   //
   // size
   //
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('image size:')
      div.appendChild(text)
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('(pixels)')
      div.appendChild(text)
      mod.pixels = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('(inches)')
      div.appendChild(text)
      mod.inches = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('(mm)')
      div.appendChild(text)
      mod.mm = text
   }
//
// local functions
//
// get size
//
function get_size() {
   var i = mod.svg.indexOf("width")
   if (i == -1) {
      var width = 1
      var height = 1
      var units = 90
      }
   else {
      var i1 = mod.svg.indexOf("\"",i+1)
      var i2 = mod.svg.indexOf("\"",i1+1)
      var width = mod.svg.substring(i1+1,i2)
      i = mod.svg.indexOf("height")
      i1 = mod.svg.indexOf("\"",i+1)
      i2 = mod.svg.indexOf("\"",i1+1)
      var height = mod.svg.substring(i1+1,i2)
      ih = mod.svg.indexOf("height")
      if (width.indexOf("px") != -1) {
         width = width.slice(0,-2)
         height = height.slice(0,-2)
         var units = 90
         }
      else if (width.indexOf("mm") != -1) {
         width = width.slice(0,-2)
         height = height.slice(0,-2)
         var units = 25.4
         }
      else if (width.indexOf("cm") != -1) {
         width = width.slice(0,-2)
         height = height.slice(0,-2)
         var units = 2.54
         }
      else if (width.indexOf("in") != -1) {
         width = width.slice(0,-2)
         height = height.slice(0,-2)
         var units = 1
         }
      else {
         var units = 90
         }
      }
   mod.width = parseFloat(width)
   mod.height = parseFloat(height)
   mod.units = units
   mod.unitstext.value = units
   }
//
// load image
//
function load_image() {
   var src = "data:image/svg+xml;base64,"+window.btoa(mod.svg)
   var img = new Image()
   img.setAttribute("src",src)
   img.onload = function() {
      var dpi = parseFloat(mod.dpi.value)
      var units = parseFloat(mod.unitstext.value)
      var width = parseInt(dpi*mod.width/units)
      var height = parseInt(dpi*mod.height/units)
      mod.pixels.nodeValue =
         width+' x '+height+" (pixels)"
      mod.inches.nodeValue =
         (width/dpi).toFixed(3)+' x '+(height/dpi).toFixed(3)+" (inches)"
      mod.mm.nodeValue =
      (25.4*width/dpi).toFixed(3)+' x '+(25.4*height/dpi).toFixed(3)+" (mm)"
      mod.img.width = width
      mod.img.height = height
      var ctx = mod.img.getContext("2d")
      ctx.clearRect(0,0,width,height)
      ctx.drawImage(img,0,0,width,height)
      if (mod.fill.checked)
         fill_image()
      else
         output_image()
      }
   }
//
// output_image
//
function output_image() {
   if (mod.img.width > mod.img.height) {
      var x0 = 0
      var y0 = mod.canvas.height*.5*(1-mod.img.height/mod.img.width)
      var w = mod.canvas.width
      var h = mod.canvas.width*mod.img.height/mod.img.width
      }
   else {
      var x0 = mod.canvas.width*.5*(1-mod.img.width/mod.img.height)
      var y0 = 0
      var w = mod.canvas.height*mod.img.width/mod.img.height
      var h = mod.canvas.height
      }
   var ctx = mod.canvas.getContext("2d")
      ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
      ctx.drawImage(mod.img,x0,y0,w,h)
   outputs.image.event()
   outputs.imageInfo.event()
   }
//
// fill image
//
function fill_image() {
   var blob = new Blob(['('+fill_worker.toString()+'())'])
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
      output_image()
      })
   var ctx = mod.canvas.getContext("2d")
   ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
   var h = mod.img.height
   var w = mod.img.width
   var ctx = mod.img.getContext("2d")
   var img = ctx.getImageData(0,0,w,h)
   webworker.postMessage({
      height:img.height,width:img.width,buffer:img.data.buffer},
      [img.data.buffer])
   }
function fill_worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var buf = new Uint8ClampedArray(evt.data.buffer)
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            alpha = buf[(h-1-row)*w*4+col*4+3]/255
            buf[(h-1-row)*w*4+col*4+0] 
               = (1-alpha)*255+alpha*buf[(h-1-row)*w*4+col*4+0] 
            buf[(h-1-row)*w*4+col*4+1] 
               = (1-alpha)*255+alpha*buf[(h-1-row)*w*4+col*4+1] 
            buf[(h-1-row)*w*4+col*4+2] 
               = (1-alpha)*255+alpha*buf[(h-1-row)*w*4+col*4+2] 
            buf[(h-1-row)*w*4+col*4+3] = 255
            }
         }
      self.postMessage({buffer:buf.buffer},[buf.buffer])
      })
   }
//
// invert image
//
function invert_image() {
   var blob = new Blob(['('+invert_worker.toString()+'())'])
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
      ctx.drawImage(mod.img,x0,y0,wd,hd)
      webworker.terminate()
      outputs.image.event()
      })
   var ctx = mod.canvas.getContext("2d")
   ctx.clearRect(0,0,mod.canvas.width,mod.canvas.height)
   var h = mod.img.height
   var w = mod.img.width
   var ctx = mod.img.getContext("2d")
   var img = ctx.getImageData(0,0,w,h)
   webworker.postMessage({
      height:img.height,width:img.width,buffer:img.data.buffer},
      [img.data.buffer])
   }
function invert_worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var buf = new Uint8ClampedArray(evt.data.buffer)
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            buf[(h-1-row)*w*4+col*4+0] 
            buf[(h-1-row)*w*4+col*4+0] 
               = 255-buf[(h-1-row)*w*4+col*4+0] 
            buf[(h-1-row)*w*4+col*4+1] 
               = 255-buf[(h-1-row)*w*4+col*4+1] 
            buf[(h-1-row)*w*4+col*4+2] 
               = 255-buf[(h-1-row)*w*4+col*4+2] 
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

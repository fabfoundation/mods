//
// motion detect
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
var name = 'motion detect'
//
// initialization
//
var init = function() {
   //
   // UI settings
   //
   mod.threshold.value = 0.025
   mod.latency.value = 15
   mod.delay.value = 1
   mod.dpi = 100
   mod.win = null
   mod.time = 0
   //
   // trigger image after latency (for start-up)
   //
   setTimeout(outputs.trigger.event,
      parseFloat(mod.latency.value)*1000)
   }
//
// inputs
//
var inputs = {
   image:{type:'RGBA',
      event:function(evt){
         var ctx = mod.img.getContext("2d")
         var lastctx = mod.lastimg.getContext("2d")
         lastctx.canvas.width = ctx.canvas.width
         lastctx.canvas.height = ctx.canvas.height
         lastctx.drawImage(mod.img,0,0)
         ctx.canvas.width = evt.detail.width
         ctx.canvas.height = evt.detail.height 
         ctx.putImageData(evt.detail,0,0)
         compare_images()
         }}}
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
      event:function(obj){
         mods.output(mod,'imageInfo',obj)}},
   trigger:{type:'event',
      event:function(){
         mods.output(mod,'trigger',null)}}}
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
   // off-screen image canvases
   //
   var canvas = document.createElement('canvas')
      mod.img = canvas
   var canvas = document.createElement('canvas')
      mod.lastimg = canvas
   //
   // view button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('view last image'))
      btn.addEventListener('click',function(){
         mod.win = window.open('')
         mod.win.document.title = 'last image'
         mod.win.document.body.style.overflow = 'hidden'
         mod.win.document.body.style.border = 0
         mod.win.document.body.style.padding = 0
         mod.win.document.body.style.margin = 0
         mod.win.addEventListener('unload',function() {
            mod.win = null
            })
         var canvas = document.createElement('canvas')
            canvas.width = mod.img.width
            canvas.height = mod.img.height
            canvas.setAttribute('id',mod.div.id+'canvas')
            mod.win.document.body.appendChild(canvas)
         var ctx = canvas.getContext("2d")
            ctx.drawImage(mod.img,0,0)
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   //
   // relative change
   //
   var text = document.createTextNode('relative change: ')
      div.appendChild(text)
      mod.changetext = text
   div.appendChild(document.createElement('br'))
   //
   // threshold
   //
   div.appendChild(document.createTextNode('threshold: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.threshold = input
   div.appendChild(document.createTextNode(' (0-1)'))
   div.appendChild(document.createElement('br'))
   //
   // latency
   //
   div.appendChild(document.createTextNode('latency: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.latency = input
   div.appendChild(document.createTextNode(' (s)'))
   div.appendChild(document.createElement('br'))
   //
   // delay
   //
   div.appendChild(document.createTextNode('delay: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.delay = input
   div.appendChild(document.createTextNode(' (s)'))
   div.appendChild(document.createElement('br'))
   }
//
// local functions
//
function open_window() {
   mod.win = window.open('')
   mod.win.document.title = 'motion detect last image'
   mod.win.document.body.style.overflow = 'hidden'
   mod.win.document.body.style.border = 0
   mod.win.document.body.style.padding = 0
   mod.win.document.body.style.margin = 0
   var canvas = document.createElement('canvas')
      canvas.setAttribute('id',mod.div.id+'canvas')
      mod.win.document.body.appendChild(canvas)
   }
function compare_images() {
   //
   // create worker
   //
   var blob = new Blob(['('+worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   var webworker = new Worker(url)
   //
   // worker handler
   //
   webworker.addEventListener('message',function(evt) {
      window.URL.revokeObjectURL(url)
      mod.changetext.nodeValue = 'relative change: '+evt.data.change.toFixed(3)
      mod.change = evt.data.change
      var time = Date.now()
      var dt = (time-mod.time)/1000
      //
      // check whether to save image
      //
      if ((mod.change > parseFloat(mod.threshold.value))
         && (dt > parseFloat(mod.latency.value))) {
         var obj = {}
         var date = new Date()
         var year = date.getFullYear()
         var month = ('0'+(1+parseInt(date.getMonth()))).slice(-2)
         var day = ('0'+date.getDate()).slice(-2)
         var hour = ('0'+date.getHours()).slice(-2)
         var minute = ('0'+date.getMinutes()).slice(-2)
         var second = ('0'+date.getSeconds()).slice(-2)
         var name = year+'-'+month+'-'+day+'-'+hour+'-'+minute+'-'+second
         obj.name = name
         obj.dpi = mod.dpi
         obj.width = mod.img.width
         obj.height = mod.img.height
         outputs.imageInfo.event(obj)
         outputs.image.event()
         mod.time = time
         }
      //
      // update canvas
      //
      var h = mod.img.height
      var w = mod.img.width
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
      //
      // update view window
      //
      if (mod.win != null) {
         var canvas = mod.win.document.getElementById(mod.div.id+'canvas')
         canvas.width = mod.win.innerWidth
         canvas.height = mod.win.innerHeight
         var iw = mod.img.width
         var ih = mod.img.height
         var cw = canvas.width
         var ch = canvas.height
         var ctx = canvas.getContext("2d")
         ctx.clearRect(0,0,cw,ch)
         if ((iw/ih) > (cw/ch))
            ctx.drawImage(mod.img,0,0,cw,cw*ih/iw)
         else
            ctx.drawImage(mod.img,0,0,ch*iw/ih,ch)
         }
      //
      // trigger next image
      //
      setTimeout(outputs.trigger.event,
         parseFloat(mod.delay.value)*1000)
      })
   //
   // call worker
   //
   var ctx = mod.img.getContext("2d")
   var img = ctx.getImageData(0,0,mod.img.width,mod.img.height)
   var ctx = mod.lastimg.getContext("2d")
   var lastimg = ctx.getImageData(0,0,mod.img.width,mod.img.height)
   var t = parseFloat(mod.threshold.value)
   webworker.postMessage({
      height:mod.img.height,width:mod.img.width,threshold:t,
      buffer:img.data.buffer,lastbuffer:lastimg.data.buffer})
   }
function worker() {
   self.addEventListener('message',function(evt) {
      var h = evt.data.height
      var w = evt.data.width
      var t = evt.data.threshold
      var buf = new Uint8ClampedArray(evt.data.buffer)
      var lastbuf = new Uint8ClampedArray(evt.data.lastbuffer)
      var change = 0
      for (var row = 0; row < h; ++row) {
         for (var col = 0; col < w; ++col) {
            r = buf[(h-1-row)*w*4+col*4+0] 
            g = buf[(h-1-row)*w*4+col*4+1] 
            b = buf[(h-1-row)*w*4+col*4+2] 
            rl = lastbuf[(h-1-row)*w*4+col*4+0] 
            gl = lastbuf[(h-1-row)*w*4+col*4+1] 
            bl = lastbuf[(h-1-row)*w*4+col*4+2] 
            change += (Math.abs(r-rl)/255 
               +Math.abs(g-gl)/255
               +Math.abs(b-bl)/255)/3
            }
         }
      change = change/(w*h)
      self.postMessage({change:change})
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

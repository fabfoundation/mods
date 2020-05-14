//
// convert rgba jpg
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2017
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
var name = 'convert RGBA to JPG'
//
// initialization
//
var init = function() {
   mod.name.value = "file.jpg"
   mod.compress.value = .75
   }
//
// inputs
//
var inputs = {
   image:{type:'RGBA',
      event:function(evt){
         var ctx = mod.img.getContext("2d")
         ctx.canvas.width = evt.detail.width
         ctx.canvas.height = evt.detail.height 
         ctx.putImageData(evt.detail,0,0)
         mod.pxtext.nodeValue = evt.detail.width+' x '+evt.detail.height+' px'
         convert_image()
         }},
   imageInfo:{type:'object',
      event:function(evt){
         mod.name.value = evt.detail.name+'.jpg'
         }}
   }
//
// outputs
//
var outputs = {
   }
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
   div.appendChild(document.createTextNode(' '))
   //
   // info div
   //
   var info = document.createElement('div')
      info.appendChild(document.createTextNode('file name: '))
      var input = document.createElement('input')
         input.type = 'text'
         input.size = 6
         info.appendChild(input)
         mod.name = input
      info.appendChild(document.createElement('br'))
      info.appendChild(document.createTextNode('compression: '))
      var input = document.createElement('input')
         input.type = 'text'
         input.size = 6
         info.appendChild(input)
         mod.compress = input
      info.appendChild(document.createTextNode(' (0-1)'))
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('px: ')
         info.appendChild(text)
         mod.pxtext = text
      div.appendChild(info)
   }
//
// local functions
//
function convert_image() {
   //
   // preview
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
   // convert and save
   //
   mod.img.toBlob(function(blob){
      var url = URL.createObjectURL(blob)
      var link = document.createElement('a')
      link.download = mod.name.value
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      },'image/jpeg',parseFloat(mod.compress.value))
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

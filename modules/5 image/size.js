//
// image size
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
var name = 'image size'
//
// initialization
//
var init = function() {
   mod.dpitext.value = 100
   }
//
// inputs
//
var inputs = {
   image:{type:'RGBA',
      event:function(evt){
         mod.input = evt.detail
         mod.pxtext.nodeValue = mod.input.width+' x '+mod.input.height+' px'
         mod.dpi = parseFloat(mod.dpitext.value)
         mod.mmtext.nodeValue = (25.4*mod.input.width/mod.dpi).toFixed(3)
            +' x '+(25.4*mod.input.height/mod.dpi).toFixed(3)+' mm'
         mod.intext.nodeValue = (mod.input.width/mod.dpi).toFixed(3)
            +' x '+(mod.input.height/mod.dpi).toFixed(3)+' in'
         mods.fit(mod.div)
         outputs.image.event()
         outputs.imageInfo.event()
         }}}
//
// outputs
//
var outputs = {
   image:{type:'RGBA',
      event:function(){
         mods.output(mod,'image',mod.input)}},
   imageInfo:{type:'object',
      event:function(){
         var obj = {}
         obj.name = "image"
         obj.dpi = parseFloat(mod.dpitext.value)
         obj.width = mod.input.width
         obj.height = mod.input.height
         mods.output(mod,'imageInfo',obj)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // info div
   //
   var info = document.createElement('div')
      info.setAttribute('id',div.id+'info')
      info.appendChild(document.createTextNode('dpi: '))
      var input = document.createElement('input')
         input.type = 'text'
         input.size = 6
         input.addEventListener('input',function(){
            mod.dpi = parseFloat(mod.dpitext.value)
            mod.mmtext.nodeValue = (25.4*mod.input.width/mod.dpi).toFixed(3)
               +' x '+(25.4*mod.input.height/mod.dpi).toFixed(3)+' mm'
            mod.intext.nodeValue = (mod.input.width/mod.dpi).toFixed(3)
               +' x '+(mod.input.height/mod.dpi).toFixed(3)+' in'
            mods.fit(mod.div)
            outputs.imageInfo.event()
            })
         info.appendChild(input)
         mod.dpitext = input
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('px')
         info.appendChild(text)
         mod.pxtext = text
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('mm')
         info.appendChild(text)
         mod.mmtext = text
      info.appendChild(document.createElement('br'))
      var text = document.createTextNode('in')
         info.appendChild(text)
         mod.intext = text
      div.appendChild(info)
   }
//
// local functions
//
;
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

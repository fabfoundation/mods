//
// cut raster
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
var name = 'cut raster'
//
// initialization
//
var init = function() {
   mod.in.value = 0.010
   mod.mm.value = 25.4*0.010
   }
//
// inputs
//
var inputs = {
   imageInfo:{type:'object',
      event:function(evt){
         mod.name = evt.detail.name
         mod.dpi = evt.detail.dpi
         mod.width = evt.detail.width
         mod.height = evt.detail.height
         }},
   path:{type:'array',
      event:function(evt){
         if (mod.label.nodeValue == 'calculating') {
            mod.label.nodeValue = 'calculate'
            mod.labelspan.style.fontWeight = 'normal'
            mod.path = evt.detail
            outputs.toolpath.event()
            }
         }}}
//
// outputs
//
var outputs = {
   offset:{type:'number',
      event:function(){
         var pixels = 0.5*parseFloat(mod.in.value)*mod.dpi
         mods.output(mod,'offset',pixels)
         }},
   toolpath:{type:'object',
      event:function(){
         cmd = {}
         cmd.path = mod.path
         cmd.name = mod.name
         cmd.dpi = mod.dpi
         cmd.width = mod.width
         cmd.height = mod.height
         mods.output(mod,'toolpath',cmd)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('tool diameter'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('mm: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         mod.in.value = parseFloat(mod.mm.value)/25.4
         })
      div.appendChild(input)
      mod.mm = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('in: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         mod.mm.value = parseFloat(mod.in.value)*25.4
         })
      div.appendChild(input)
      mod.in = input
   div.appendChild(document.createElement('br'))
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
         outputs.offset.event()
         })
      div.appendChild(btn)
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


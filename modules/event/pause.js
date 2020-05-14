//
// pause event
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
var name = 'pause event'
//
// initialization
//
var init = function() {
   }
//
// inputs
//
var inputs = {
   input:{type:'event',
      event:function(evt){
         mod.input = evt.detail
         mod.event.value = evt.detail
         mod.label.nodeValue = 'click to continue'
         mod.labelspan.style.fontWeight = 'bold'
         }}}
//
// outputs
//
var outputs = {
   output:{type:'event',
      event:function(){
         mods.output(mod,'output',mod.input)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // pause button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      var span = document.createElement('span')
         var text = document.createTextNode('waiting for event')
            mod.label = text
            span.appendChild(text)
         mod.labelspan = span
         btn.appendChild(span)
      btn.addEventListener('click',function(){
         mod.label.nodeValue = 'waiting for event'
         mod.labelspan.style.fontWeight = 'normal'
         outputs.output.event()
         })
      div.appendChild(btn)
   //
   // event value
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('value: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         })
      div.appendChild(input)
      mod.event = input
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

//
// delay event
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
var name = 'delay event'
//
// initialization
//
var init = function() {
   mod.delay.value = 1
   }
//
// inputs
//
var inputs = {
   input:{type:'event',
      event:function(evt){
         mod.input = evt.detail
         mod.event.value = JSON.stringify(evt.detail)
         delay_event()
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
   // delay label
   //
   var span = document.createElement('span')
      var text = document.createTextNode('waiting for event')
         mod.label = text
         span.appendChild(text)
      mod.labelspan = span
      div.appendChild(span)
   //
   // delay value
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('delay (s): '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         })
      div.appendChild(input)
      mod.delay = input
   //
   // event value
   //
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('event value: '))
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
function delay_event() {
   mod.label.nodeValue = 'delaying event'
   mod.labelspan.style.fontWeight = 'bold'
   var delay = 1000*parseFloat(mod.delay.value)
   window.setTimeout(after_delay,delay)
   }
function after_delay() {
   mod.label.nodeValue = 'waiting for event'
   mod.labelspan.style.fontWeight = 'normal'
   outputs.output.event()
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

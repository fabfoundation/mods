//
// step
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
var name = 'step'
//
// initialization
//
var init = function() {
   mod.value.value = ''
   mod.start.value = 0
   mod.stop.value = 10
   mod.step.value = 1
   }
//
// inputs
//
var inputs = {
   start:{type:'event',
      event:function(evt) {
         mod.nextvalue = parseFloat(mod.start.value)
         update_value()
         }},
   step:{type:'event',
      event:function(evt) {
         update_value()
         }}}
//
// outputs
//
var outputs = {
   begin:{type:'event',
      event:function() {
         mods.output(mod,'begin','begin')
         }},
   value:{type:'number',
      event:function() {
         mods.output(mod,'value',parseFloat(mod.value.value))
         }},
   end:{type:'event',
      event:function() {
         mods.output(mod,'end','end')
         }}}
//
// interface
//
var interface = function(div) {
   mod.div = div
   div.appendChild(document.createTextNode('value: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.value = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('start: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.start = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('stop: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.stop = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('step: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.step = input
   }
//
// local functions
//
function update_value() {
   var value = mod.nextvalue
   mod.value.value = value
   var start = parseFloat(mod.start.value)
   var stop  = parseFloat(mod.stop.value)
   var step  = parseFloat(mod.step.value)
   if (value == start)
      outputs.begin.event()
   if (start < stop) {
      if (value <= stop) {
         outputs.value.event()
         mod.nextvalue = value + step
         }
      else {
         mod.value.value = ''
         outputs.end.event()
         }
      }
   else {
      if (value >= stop) {
         outputs.value.event()
         mod.nextvalue = value + step
         }
      else {
         mod.value.value = ''
         outputs.end.event()
         }
      }
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

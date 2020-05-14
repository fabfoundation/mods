//
// bar graph
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
var name = 'bar graph'
//
// initialization
//
var init = function() {
   var min = 0
   var max = 1
   mod.meter.min = min
   mod.min.value = min
   mod.meter.max = max
   mod.max.value = max
   mod.meter.value = (max+min)/2
   mod.value.value = mod.meter.value
   }
//
// inputs
//
var inputs = {
   value:{type:'number',
      event:function(evt){
         mod.meter.value = parseFloat(evt.detail)
         mod.value.value = evt.detail
         }}}
//
// outputs
//
var outputs = {}
//
// interface
//
var interface = function(div){
   mod.div = div
   var meter = document.createElement('meter')
      meter.style.width = mods.ui.canvas
      meter.style.margin = mods.ui.padding
      div.appendChild(meter)
      mod.meter = meter
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('min: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(evt){
         mod.meter.min = parseFloat(mod.min.value)
         })
      div.appendChild(input)
      mod.min = input
   div.appendChild(document.createTextNode(' value: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(evt){
         mod.meter.value = parseFloat(mod.value.value)
         })
      div.appendChild(input)
      mod.value = input
   div.appendChild(document.createTextNode(' max: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(evt){
         mod.meter.max = parseFloat(mod.max.value)
         })
      div.appendChild(input)
      mod.max = input
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

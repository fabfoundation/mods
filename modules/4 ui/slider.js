//
// control slider
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
var name = 'slider'
//
// initialization
//
var init = function() {
   var min = 0
   var max = 1
   mod.range.min = min
   mod.min.value = min
   mod.range.max = max
   mod.max.value = max
   mod.range.step = (max-min)/mods.ui.canvas
   mod.range.value = (max+min)/2
   mod.value.value = mod.range.value
   }
//
// inputs
//
var inputs = {}
//
// outputs
//
var outputs = {
   value:{type:'',
      event:function(){
         mods.output(mod,'value',parseFloat(mod.range.value))}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   input = document.createElement('input')
      input.type = 'range'
      input.style.width = mods.ui.canvas
      input.addEventListener('input',function(evt){
         mod.value.value = mod.range.value
         outputs.value.event()
         })
      div.appendChild(input)
      mod.range = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('min: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(evt){
         mod.range.min = parseFloat(mod.min.value)
         mod.range.step = 
            (parseFloat(mod.range.max)-parseFloat(mod.range.min))
            /mods.ui.canvas
         })
      div.appendChild(input)
      mod.min = input
   div.appendChild(document.createTextNode(' value: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(evt){
         mod.range.value = parseFloat(mod.value.value)
         outputs.value.event()
         })
      div.appendChild(input)
      mod.value = input
   div.appendChild(document.createTextNode(' max: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(evt){
         mod.range.max = parseFloat(mod.max.value)
         mod.range.step = 
            (parseFloat(mod.range.max)-parseFloat(mod.range.min))
            /mods.ui.canvas
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

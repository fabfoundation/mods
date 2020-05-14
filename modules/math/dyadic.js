//
// dyadic math expression module
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
var name = 'math expression'
//
// initialization
//
var init = function() {
   mod.x = 123
   mod.xtext.value = mod.x
   mod.y = 456
   mod.ytext.value = mod.y
   mod.etext.value = '3*x+4*y'
   outputs.z.event()
   }
//
// inputs
//
var inputs = {
   x:{type:'number',
      event:function(evt){
         mod.x = evt.detail
         mod.xtext.value = mod.x
         outputs.z.event()}},
   y:{type:'number',
      event:function(evt){
         mod.y = evt.detail
         mod.ytext.value = mod.y
         outputs.z.event()}}}
//
// outputs
//
var outputs = {
   z:{type:'number',
      event:function(){
         var x = mod.x
         var y = mod.y
         var z = eval(mod.etext.value)
         mod.ztext.value = z
         mods.output(mod,'z',z)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('x: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(evt){
         mod.x = parseFloat(mod.xtext.value)
         outputs.z.event()
         })
      div.appendChild(input)
      mod.xtext = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('y: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(evt){
         mod.y = parseFloat(mod.ytext.value)
         outputs.z.event()
         })
      div.appendChild(input)
      mod.ytext = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('expression: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      input.addEventListener('input',function(evt){
         outputs.z.event()
      })
      div.appendChild(input)
      mod.etext = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('z: '))
   input= document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.ztext = input
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

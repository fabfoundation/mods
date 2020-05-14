//
// scalar math expression module
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
   expression = '3*x+0.5'
   mod.etext.value = expression
   outputs.y.event()
   }
//
// inputs
//
var inputs = {
   x:{type:'number',
      event:function(evt){
         mod.x = evt.detail
         mod.xtext.value = mod.x
         outputs.y.event()}}}
//
// outputs
//
var outputs = {
   y:{type:'number',
      event:function(){
         var x = mod.x
         var y = eval(mod.etext.value)
         mod.ytext.value = y
         mods.output(mod,'y',y)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('x: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(evt){
         mod.x = parseFloat(mod.xtext.value)
         outputs.y.event()
         })
      div.appendChild(input)
      mod.xtext = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('expression: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      input.addEventListener('input',function(evt){
         outputs.y.event()
         })
      div.appendChild(input)
      mod.etext = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('y: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.ytext = input
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

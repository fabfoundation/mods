//
// character variable
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
var name = 'character variable'
//
// initialization
//
var init = function() {
   }
//
// inputs
//
var inputs = {
   input:{type:'character',
      event:function(evt){
         var str = evt.detail
         mod.character.value = str.slice(-1)
         outputs.output.event()
         }}}
//
// outputs
//
var outputs = {
   output:{type:'character',
      event:function(){
         mods.output(mod,'output',mod.character.value)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('character: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 1
      input.addEventListener('input',function(evt){
         var str = evt.target.value
         mod.character.value = str.slice(-1)
         outputs.output.event()
         })
      div.appendChild(input)
      mod.character = input
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

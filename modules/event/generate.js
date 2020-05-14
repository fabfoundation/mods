//
// event generator
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
var name = 'generate event'
//
// initialization
//
var init = function() {
   mod.event.value = 'event'
   }
//
// inputs
//
var inputs = {
   trigger:{type:'event',
      event:function(evt){
         outputs.output.event()
         }}}
//
// outputs
//
var outputs = {
   output:{type:'event',
      event:function(){
         mods.output(mod,'output',mod.event.value)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // generate button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('generate'))
      btn.addEventListener('click',function(){
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

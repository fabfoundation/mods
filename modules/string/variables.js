//
// string variables
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
var name = 'string variables'
//
// initialization
//
var init = function() {
   mod.text1.value = 'value 1'
   mod.text2.value = 'value 2'
   }
//
// inputs
//
var inputs = {
   var1:{type:'string',
      event:function(evt){
         mod.text1.value = evt.detail
         outputs.var1.event()}},
   var2:{type:'string',
      event:function(evt){
         mod.text2.value = evt.detail
         outputs.var2.event()}}}
//
// outputs
//
var outputs = {
   var1:{type:'string',
      event:function(){
         mods.output(mod,'var1',mod.text1.value)}},
   var2:{type:'string',
      event:function(){
         mods.output(mod,'var2',mod.text2.value)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('var1: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('keydown',function(evt){
         if (evt.key == 'Enter')
            outputs.var1.event()
         })
      div.appendChild(input)
      mod.text1 = input
   div.appendChild(document.createTextNode(' (enter)'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('var2: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('keydown',function(evt){
         if (evt.key == 'Enter')
            outputs.var2.event()
         })
      div.appendChild(input)
      mod.text2 = input
   div.appendChild(document.createTextNode(' (enter)'))
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

//
// character parse
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
var name = 'character parse'
//
// initialization
//
var init = function() {
   mod.array = [0,0,0,0,0,0,0]
   mod.function.value =
"mod.array.splice(0,1);\n\
mod.array.splice(7,0,evt.detail.charCodeAt(0));\n\
if ((mod.array[0] == 1) & (mod.array[1] == 2) & (mod.array[2] == 3) & (mod.array[3] == 4)) {\n\
   var value = (mod.array[4] + 256*mod.array[5] + 256*256*mod.array[6])/100;\n\
   mod.out.value = value;\n\
   outputs.out.event(value);\n\
   }"
   }
//
// inputs
//
var inputs = {
   in:{type:'character',
      event:function(evt) {
         mod.in.value = evt.detail
         eval(mod.function.value)
         }}}
//
// outputs
//
var outputs = {
   out:{type:'string',
      event:function(value){
         mods.output(mod,'out',value)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('in: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.in = input
   div.appendChild(document.createTextNode(' out: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.out = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('function:'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',mods.ui.rows)
      text.setAttribute('cols',mods.ui.cols)
      text.addEventListener('input',function(evt) {
         format_string()
         })
      div.appendChild(text)
      mod.function = text
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

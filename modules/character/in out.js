//
// character input output
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
var name = 'character in out'
//
// initialization
//
var init = function() {
   }
//
// inputs
//
var inputs = {
   in:{type:'character',
      event:function(evt) {
         mod.in.value += evt.detail
         }}}
//
// outputs
//
var outputs = {
   out:{type:'character',
      event:function(chr){
         mods.output(mod,'out',chr)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('in:'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',mods.ui.rows)
      text.setAttribute('cols',mods.ui.cols)
      div.appendChild(text)
      mod.in = text
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('out:'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',mods.ui.rows)
      text.setAttribute('cols',mods.ui.cols)
      text.addEventListener('input',function(evt) {
         outputs.out.event(mod.out.value.slice(-1))
         })
      div.appendChild(text)
      mod.out = text
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('clear'))
      btn.addEventListener('click',function(){
         mod.in.value = ""
         mod.out.value = ""
         })
      div.appendChild(btn)
   }
//
// local functions
//
function format_string() {
   mod.value.value = eval(mod.expression.value)
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

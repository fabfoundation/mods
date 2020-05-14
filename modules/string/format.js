//
// format string
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2015
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
var name = 'format string'
//
// initialization
//
var init = function() {
   mod.expression.value = "'var1: '+mod.var1+', var2: '+mod.var2"
   }
//
// inputs
//
var inputs = {
   var1:{type:'String',
      event:function(evt) {
         mod.var1 = evt.detail
         format_string()
         }},
   var2:{type:'String',
      event:function(evt) {
         mod.var2 = evt.detail
         format_string()
         }}}
//
// outputs
//
var outputs = {
   output:{type:'String',
      event:function(){
         mods.output(mod,'output',mod.value.value)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('expression:'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',mods.ui.rows)
      text.setAttribute('cols',mods.ui.cols)
      text.addEventListener('input',function(evt) {
         format_string()
         })
      div.appendChild(text)
      mod.expression = text
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('value:'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',mods.ui.rows)
      text.setAttribute('cols',mods.ui.cols)
      div.appendChild(text)
      mod.value = text
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

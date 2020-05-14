//
// frep shell
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2018
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
var name = 'frep shell'
//
// initialization
//
var init = function() {
   mod.offset.value = 0.1
   }
//
// inputs
//
var inputs = {
   shape:{type:'',
      event:function(evt){
         mod.shape = evt.detail
         outputs.shape.event()
         }}}
//
// outputs
//
var outputs = {
   shape:{type:'',
      event:function(){
         var limits = []
         for (var v = 0; v < mod.shape.limits.length; ++v) {
            limits[v] = []
            limits[v][0] = mod.shape.limits[v][0]
            limits[v][1] = mod.shape.limits[v][1]
            }
         var variables = mod.shape.variables
         var fn = mod.shape.function
         var offset = parseFloat(mod.offset.value)
         fn = `Math.min((${offset})-(${fn}),${fn})`
         var shape = {function:fn,variables:mod.shape.variables,limits:limits,type:mod.shape.type}
         mod.fn.value = fn
         mods.output(mod,'shape',shape)}
         }}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // offset
   //
   div.appendChild(document.createTextNode('offest: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.offset = input
   div.appendChild(document.createElement('br'))
   //
   // function
   //
   div.appendChild(document.createTextNode('function: '))
   div.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.fn = input
   div.appendChild(document.createElement('br'))
   //
   // output button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('output'))
      btn.addEventListener('click',function(){
         outputs.shape.event()
         })
      div.appendChild(btn)
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

//
// frep inflate
//    todo: better Z limit
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
var name = 'frep inflate'
//
// initialization
//
var init = function() {
   mod.scale.value = 1
   }
//
// inputs
//
var inputs = {
   shape:{type:'2D',
      event:function(evt){
         mod.shape = evt.detail
         outputs.shape.event()
         }}}
//
// outputs
//
var outputs = {
   shape:{type:'3D',
      event:function(){
         var variables = []
         variables[0] = mod.shape.variables[0]
         variables[1] = mod.shape.variables[1]
         variables[2] = 'Z'
         var scale = parseFloat(mod.scale.value)
         var limits = []
         limits[0] = [mod.shape.limits[0][0],mod.shape.limits[0][1]]
         limits[1] = [mod.shape.limits[1][0],mod.shape.limits[1][1]]
         limits[2] = [0,limits[0][1]-limits[0][0]]
         fn = `((${scale})*(${mod.shape.function})-Z)`
         fn = `Math.min(${mod.shape.function},${fn})`
         fn = `Math.min(Z,${fn})`
         var shape = {function:fn,variables:variables,limits:limits,type:mod.shape.type}
         mod.fn.value = fn
         mods.output(mod,'shape',shape)}
         }}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // scale
   //
   div.appendChild(document.createTextNode('scale: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.scale = input
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

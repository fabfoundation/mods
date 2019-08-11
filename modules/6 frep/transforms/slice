//
// frep slice
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
var name = 'frep slice'
//
// initialization
//
var init = function() {
   mod.x0.value = ''
   mod.x1.value = ''
   mod.y0.value = ''
   mod.y1.value = ''
   mod.z0.value = ''
   mod.z1.value = 0
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
         if (mod.x0.value != '') {
            var x0 = parseFloat(mod.x0.value)
            var xvar = variables[0]
            fn = `Math.min((${xvar}-(${x0})),(${fn}))`
            limits[0][0] = Math.max(limits[0][0],x0)
            }
         if (mod.x1.value != '') {
            var x1 = parseFloat(mod.x1.value)
            var xvar = variables[0]
            fn = `Math.min(((${x1})-${xvar}),(${fn}))`
            limits[0][1] = Math.min(limits[0][1],x1)
            }
         if (mod.y0.value != '') {
            var y0 = parseFloat(mod.y0.value)
            var yvar = variables[1]
            fn = `Math.min((${yvar}-(${y0})),(${fn}))`
            limits[1][0] = Math.max(limits[1][0],y0)
            }
         if (mod.y1.value != '') {
            var y1 = parseFloat(mod.y1.value)
            var yvar = variables[1]
            fn = `Math.min(((${y1})-${yvar}),(${fn}))`
            limits[1][1] = Math.min(limits[1][1],y1)
            }
         if (mod.z0.value != '') {
            var z0 = parseFloat(mod.z0.value)
            var zvar = variables[2]
            fn = `Math.min((${zvar}-(${z0})),(${fn}))`
            limits[2][0] = Math.max(limits[2][0],z0)
            }
         if (mod.z1.value != '') {
            var z1 = parseFloat(mod.z1.value)
            var zvar = variables[2]
            fn = `Math.min(((${z1})-${zvar}),(${fn}))`
            limits[2][1] = Math.min(limits[2][1],z1)
            }
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
   // x0
   //
   div.appendChild(document.createTextNode('x0: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.x0 = input
   //
   // x1
   //
   div.appendChild(document.createTextNode(' x1: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.x1 = input
   div.appendChild(document.createElement('br'))
   //
   // y0
   //
   div.appendChild(document.createTextNode('y0: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.y0 = input
   //
   // y1
   //
   div.appendChild(document.createTextNode(' y1: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.y1 = input
   div.appendChild(document.createElement('br'))
   //
   // z0
   //
   div.appendChild(document.createTextNode('z0: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.z0 = input
   //
   // z1
   //
   div.appendChild(document.createTextNode(' z1: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.z1 = input
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

//
// frep scale
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
var name = 'frep scale'
//
// initialization
//
var init = function() {
   mod.ox.value = 0
   mod.oy.value = 0
   mod.oz.value = ''
   mod.sx.value = 2
   mod.sy.value = .5
   mod.sz.value = ''
   }
//
// inputs
//
var inputs = {
   shape:{type:'',
      event:function(evt){
         mod.shape = evt.detail
         outputs.shape.event()
         }},
   variables:{type:'',
      event:function(evt){
         for (var p in evt.detail)
            mod[p].value = evt.detail[p]
         outputs.shape.event()
         }}}
//
// outputs
//
var outputs = {
   shape:{type:'',
      event:function(){
         var fn = mod.shape.function
         var variables = mod.shape.variables
         var type = mod.shape.type        
         var limits = []
         for (var v = 0; v < mod.shape.limits.length; ++v) {
            limits[v] = []
            limits[v][0] = mod.shape.limits[v][0]
            limits[v][1] = mod.shape.limits[v][1]
            }
         if (mod.ox.value != '') {
            var ox = parseFloat(mod.ox.value)
            var sx = parseFloat(mod.sx.value)
            var xvar = variables[0]
            var re = new RegExp(xvar,'g')
            fn = fn.replace(re,`((${ox})+(${xvar}-(${ox}))/(${sx}))`)
            limits[0][0] = ox+(limits[0][0]-ox)*sx
            limits[0][1] = ox+(limits[0][1]-ox)*sx
            }
         if (mod.oy.value != '') {
            var oy = parseFloat(mod.oy.value)
            var sy = parseFloat(mod.sy.value)
            var yvar = variables[1]
            var re = new RegExp(yvar,'g')
            fn = fn.replace(re,`((${oy})+(${yvar}-(${oy}))/(${sy}))`)
            limits[1][0] = oy+(limits[1][0]-oy)*sy
            limits[1][1] = oy+(limits[1][1]-oy)*sy
            }
         if (mod.oz.value != '') {
            var oz = parseFloat(mod.oz.value)
            var sz = parseFloat(mod.sz.value)
            var zvar = variables[2]
            var re = new RegExp(zvar,'g')
            fn = fn.replace(re,`((${oz})+(${zvar}-(${oz}))/(${sz}))`)
            limits[2][0] = oz+(limits[2][0]-oz)*sz
            limits[2][1] = oz+(limits[2][1]-oz)*sz
            }
         var shape = {function:fn,variables:variables,limits:limits,type:type}
         mods.output(mod,'shape',shape)}
         }}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // origin
   //
   div.appendChild(document.createTextNode('origin x: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.ox = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('y: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.oy = input
   div.appendChild(document.createTextNode(' z: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.oz = input
   div.appendChild(document.createElement('br'))
   //
   // scale
   //
   div.appendChild(document.createTextNode('scale x: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.sx = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('y: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.sy = input
   div.appendChild(document.createTextNode(' z: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.sz = input
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

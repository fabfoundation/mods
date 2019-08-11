//
// frep reflect
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
var name = 'frep reflect'
//
// initialization
//
var init = function() {
   mod.origin0.value = 0
   mod.origin1.value = 0
   mod.x.checked = true
   mod.y.checked = false
   mod.z.checked = false 
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
         var fn = mod.shape.function
         var variables = mod.shape.variables
         var type = mod.shape.type        
         var origin0 = parseFloat(mod.origin0.value)
         var origin1 = parseFloat(mod.origin1.value)
         var limits = []
         for (var v = 0; v < mod.shape.limits.length; ++v) {
            limits[v] = []
            limits[v][0] = mod.shape.limits[v][0]
            limits[v][1] = mod.shape.limits[v][1]
            }
         if (mod.x.checked) {
            var xvar = variables[0]
            var re = new RegExp(xvar,'g')
            fn = fn.replace(re,`(${2*origin0}-(${xvar}))`)
            var dx = mod.shape.limits[0][1]-mod.shape.limits[0][0]
            var dl = mod.shape.limits[0][0]-origin0
            limits[0][0] = origin0-(dl+dx)
            limits[0][1] = origin0-dl
            }
         else if (mod.y.checked) {
            var yvar = variables[1]
            var re = new RegExp(yvar,'g')
            fn = fn.replace(re,`(${2*origin0}-(${yvar}))`)
            var dy = mod.shape.limits[1][1]-mod.shape.limits[1][0]
            var dl = mod.shape.limits[1][0]-origin0
            limits[1][0] = origin0-(dl+dy)
            limits[1][1] = origin0-dl
            }
         else if (mod.z.checked) {
            var zvar = variables[2]
            var re = new RegExp(zvar,'g')
            fn = fn.replace(re,`(${2*origin0}-(${zvar}))`)
            var dz = mod.shape.limits[2][1]-mod.shape.limits[2][0]
            var dl = mod.shape.limits[2][0]-origin0
            limits[2][0] = origin0-(dl+dz)
            limits[2][1] = origin0-dl
            }
         else if (mod.xy.checked) {
            var xvar = variables[0]
            var yvar = variables[1]
            var xre = new RegExp(xvar,'g')
            var yre = new RegExp(yvar,'g')
            fn = fn.replace(xre,'TEMP')
            fn = fn.replace(yre,`((${origin1})+(${xvar})-(${origin0}))`)
            fn = fn.replace(/TEMP/g,`((${origin0})+(${yvar})-(${origin1}))`)
            var dx = mod.shape.limits[0][1]-mod.shape.limits[0][0]
            var dy = mod.shape.limits[1][1]-mod.shape.limits[1][0]
            var dxl = mod.shape.limits[0][0]-origin0
            var dyl = mod.shape.limits[1][0]-origin1
            limits[0][0] = origin0+dyl
            limits[0][1] = origin0+dyl+dy
            limits[1][0] = origin1+dxl
            limits[1][1] = origin1+dxl+dx
            }
         else if (mod.xz.checked) {
            var xvar = variables[0]
            var zvar = variables[2]
            var xre = new RegExp(xvar,'g')
            var zre = new RegExp(zvar,'g')
            fn = fn.replace(xre,'TEMP')
            fn = fn.replace(zre,`((${origin1})+(${xvar})-(${origin0}))`)
            fn = fn.replace(/TEMP/g,`((${origin0})+(${zvar})-(${origin1}))`)
            var dx = mod.shape.limits[0][1]-mod.shape.limits[0][0]
            var dz = mod.shape.limits[2][1]-mod.shape.limits[2][0]
            var dxl = mod.shape.limits[0][0]-origin0
            var dzl = mod.shape.limits[2][0]-origin1
            limits[0][0] = origin0+dzl
            limits[0][1] = origin0+dzl+dz
            limits[2][0] = origin1+dxl
            limits[2][1] = origin1+dxl+dx
            }
         else if (mod.yz.checked) {
            var yvar = variables[1]
            var zvar = variables[2]
            var yre = new RegExp(yvar,'g')
            var zre = new RegExp(zvar,'g')
            fn = fn.replace(yre,'TEMP')
            fn = fn.replace(zre,`((${origin1})+(${yvar})-(${origin0}))`)
            fn = fn.replace(/TEMP/g,`((${origin0})+(${zvar})-(${origin1}))`)
            var dy = mod.shape.limits[1][1]-mod.shape.limits[1][0]
            var dz = mod.shape.limits[2][1]-mod.shape.limits[2][0]
            var dyl = mod.shape.limits[1][0]-origin0
            var dzl = mod.shape.limits[2][0]-origin1
            limits[1][0] = origin0+dzl
            limits[1][1] = origin0+dzl+dz
            limits[2][0] = origin1+dyl
            limits[2][1] = origin1+dyl+dy
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
   // axis
   //
   div.appendChild(document.createTextNode('axis: '))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('x'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      input.id = mod.div.id+'x'
      div.appendChild(input)
      mod.x = input
   div.appendChild(document.createTextNode(' y'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      input.id = mod.div.id+'y'
      div.appendChild(input)
      mod.y = input
   div.appendChild(document.createTextNode(' z'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      input.id = mod.div.id+'z'
      div.appendChild(input)
      mod.z = input
   div.appendChild(document.createElement('br'))
   //
   // origin 0
   //
   div.appendChild(document.createTextNode('origin 0: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.origin0 = input
   div.appendChild(document.createElement('br'))
   //
   // axis
   //
   div.appendChild(document.createTextNode('xy'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      input.id = mod.div.id+'xy'
      div.appendChild(input)
      mod.xy = input
   div.appendChild(document.createTextNode(' xz'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      input.id = mod.div.id+'xz'
      div.appendChild(input)
      mod.xz = input
   div.appendChild(document.createTextNode(' yz'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      input.id = mod.div.id+'yz'
      div.appendChild(input)
      mod.yz = input
   div.appendChild(document.createElement('br'))
   //
   // origin 1
   //
   div.appendChild(document.createTextNode('origin 1: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.origin1 = input
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

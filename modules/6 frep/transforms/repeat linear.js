//
// frep repeat linear
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
var name = 'frep repeat linear'
//
// initialization
//
var init = function() {
   mod.x.checked = true
   mod.y.checked = false 
   mod.z.checked = false 
   mod.spacing.value = 0
   mod.number.value = 10
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
         var spacing = parseFloat(mod.spacing.value)
         var number = parseInt(mod.number.value)
         var limits = []
         for (var v = 0; v < mod.shape.limits.length; ++v) {
            limits[v] = []
            limits[v][0] = mod.shape.limits[v][0]
            limits[v][1] = mod.shape.limits[v][1]
            }
         if (mod.x.checked) {
            var xvar = variables[0]
            var xmin = limits[0][0]
            var xmax = limits[0][1]
            var re = new RegExp(xvar,'g')
            fn = fn.replace(re,`((${xmin})+(${xvar}-(${xmin}))%(${spacing+xmax-xmin}))`)
            fn = `Math.min(${xvar}-(${xmin}),${fn})`
            fn = `Math.min((${xmin+number*(spacing+xmax-xmin)})-${xvar},${fn})`
            limits[0][1] = xmin+number*(xmax-xmin)+(number-1)*spacing
            }
         else if (mod.y.checked) {
            var yvar = variables[1]
            var ymin = limits[1][0]
            var ymax = limits[1][1]
            var re = new RegExp(yvar,'g')
            fn = fn.replace(re,`((${ymin})+(${yvar}-(${ymin}))%(${spacing+ymax-ymin}))`)
            fn = `Math.min(${yvar}-(${ymin}),${fn})`
            fn = `Math.min((${ymin+number*(spacing+ymax-ymin)})-${yvar},${fn})`
            limits[1][1] = ymin+number*(ymax-ymin)+(number-1)*spacing
            }
         else if (mod.z.checked) {
            var zvar = variables[2]
            var zmin = limits[2][0]
            var zmax = limits[2][1]
            var re = new RegExp(zvar,'g')
            fn = fn.replace(re,`((${zmin})+(${zvar}-(${zmin}))%(${spacing+zmax-zmin}))`)
            fn = `Math.min(${zvar}-(${zmin}),${fn})`
            fn = `Math.min((${zmin+number*(spacing+zmax-zmin)})-${zvar},${fn})`
            limits[2][1] = zmin+number*(zmax-zmin)+(number-1)*spacing
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
   // spacing
   //
   div.appendChild(document.createTextNode('spacing: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.spacing = input
   div.appendChild(document.createElement('br'))
   //
   // number 
   //
   div.appendChild(document.createTextNode('number: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.number = input
   div.appendChild(document.createElement('br'))
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

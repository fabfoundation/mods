//
// frep revolve
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
var name = 'frep revolve'
//
// initialization
//
var init = function() {
   mod.x.checked = false
   mod.y.checked = false
   mod.z.checked = true
   mod.origin.value = 0
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
         var fn = mod.shape.function
         var variables = []
         variables[0] = mod.shape.variables[0]
         variables[1] = mod.shape.variables[1]
         variables[2] = 'Z'
         var type = mod.shape.type        
         var o = parseFloat(mod.origin.value)
         var xmin = mod.shape.limits[0][0]
         var xmax = mod.shape.limits[0][1]
         var ymin = mod.shape.limits[1][0]
         var ymax = mod.shape.limits[1][1]
         var xvar = variables[0]
         var yvar = variables[1]
         var xre = new RegExp(xvar,'g')
         var yre = new RegExp(yvar,'g')
         var limits = []
         if (mod.x.checked) {
            fn = fn.replace(yre,`((${o})+Math.sqrt((${yvar}-(${o}))*(${yvar}-(${o}))+Z*Z))`)
            limits[0] = [xmin,xmax]
            limits[1] = [o-(ymax-o),o+(ymax-o)]
            limits[2] = [-(ymax-o),+(ymax-o)]
            }
         else if (mod.y.checked) {
            fn = fn.replace(xre,`((${o})+Math.sqrt((${xvar}-(${o}))*(${xvar}-(${o}))+Z*Z))`)
            limits[0] = [o-(xmax-o),o+(xmax-o)]
            limits[1] = [ymin,ymax]
            limits[2] = [-(xmax-o),+(xmax-o)]
            }
         else if (mod.z.checked) {
            fn = fn.replace(yre,`Z`)
            fn = fn.replace(xre,`((${o})+Math.sqrt((${xvar}-(${o}))*(${xvar}-(${o}))+Y*Y))`)
            limits[0] = [o-(xmax-o),o+(xmax-o)]
            limits[1] = [-(xmax-o),+(xmax-o)]
            limits[2] = [ymin,ymax]
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
   // origin
   //
   div.appendChild(document.createTextNode('origin: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.origin = input
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

//
// frep taper 
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
var name = 'frep taper'
//
// initialization
//
var init = function() {
   mod.variable0.value = 0
   mod.variable1.value = 1
   mod.scale0.value = 2
   mod.scale1.value = .5
   mod.originx.value = 0
   mod.originy.value = 0
   mod.xy.checked = true
   mod.xz.checked = false
   mod.yz.checked = false
   mod.xyz.checked = false
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
         var var0 = parseFloat(mod.variable0.value)
         var var1 = parseFloat(mod.variable1.value)
         var dvar = var1-var0
         var s0 = parseFloat(mod.scale0.value)
         var s1 = parseFloat(mod.scale1.value)
         var ds = s1-s0
         var ox = parseFloat(mod.originx.value)
         var oy = parseFloat(mod.originy.value)
         var limits = []
         for (var v = 0; v < mod.shape.limits.length; ++v) {
            limits[v] = []
            limits[v][0] = mod.shape.limits[v][0]
            limits[v][1] = mod.shape.limits[v][1]
            }
         if (mod.xy.checked) {
            var xvar = variables[0]
            var yvar = variables[1]
            var re = new RegExp(xvar,'g')
            fn = fn.replace(re,`((${ox})+(${xvar}-(${ox}))/((${s0})+(${ds})*(${yvar}-(${var0}))/(${dvar})))`)
            var xmin = limits[0][0]
            var xmax = limits[0][1]
            var ymin = limits[1][0]
            var ymax = limits[1][1]
            var x00 = ox+(xmin-ox)*(s0+ds*(ymin-var0)/dvar)
            var x01 = ox+(xmin-ox)*(s0+ds*(ymax-var0)/dvar)
            limits[0][0] = Math.min(x00,x01)
            var x10 = ox+(xmax-ox)*(s0+ds*(ymin-var0)/dvar)
            var x11 = ox+(xmax-ox)*(s0+ds*(ymax-var0)/dvar)
            limits[0][1] = Math.max(x10,x11)
            }
         else if (mod.xz.checked) {
            var xvar = variables[0]
            var zvar = variables[2]
            var re = new RegExp(xvar,'g')
            fn = fn.replace(re,`((${ox})+(${xvar}-(${ox}))/((${s0})+(${ds})*(${zvar}-(${var0}))/(${dvar})))`)
            var xmin = limits[0][0]
            var xmax = limits[0][1]
            var zmin = limits[2][0]
            var zmax = limits[2][1]
            var x00 = ox+(xmin-ox)*(s0+ds*(zmin-var0)/dvar)
            var x01 = ox+(xmin-ox)*(s0+ds*(zmax-var0)/dvar)
            limits[0][0] = Math.min(x00,x01)
            var x10 = ox+(xmax-ox)*(s0+ds*(zmin-var0)/dvar)
            var x11 = ox+(xmax-ox)*(s0+ds*(zmax-var0)/dvar)
            limits[0][1] = Math.max(x10,x11)
            }
         else if (mod.yz.checked) {
            var yvar = variables[1]
            var zvar = variables[2]
            var re = new RegExp(yvar,'g')
            fn = fn.replace(re,`((${oy})+(${yvar}-(${oy}))/((${s0})+(${ds})*(${zvar}-(${var0}))/(${dvar})))`)
            var ymin = limits[1][0]
            var ymax = limits[1][1]
            var zmin = limits[2][0]
            var zmax = limits[2][1]
            var y00 = oy+(ymin-oy)*(s0+ds*(zmin-var0)/dvar)
            var y01 = oy+(ymin-oy)*(s0+ds*(zmax-var0)/dvar)
            limits[1][0] = Math.min(y00,y01)
            var y10 = oy+(ymax-oy)*(s0+ds*(zmin-var0)/dvar)
            var y11 = oy+(ymax-oy)*(s0+ds*(zmax-var0)/dvar)
            limits[1][1] = Math.max(y10,y11)
            }
         else if (mod.xyz.checked) {
            var xvar = variables[0]
            var yvar = variables[1]
            var zvar = variables[2]
            var xre = new RegExp(xvar,'g')
            var yre = new RegExp(yvar,'g')
            fn = fn.replace(xre,`((${ox})+(${xvar}-(${ox}))/((${s0})+(${ds})*(${zvar}-(${var0}))/(${dvar})))`)
            fn = fn.replace(yre,`((${oy})+(${yvar}-(${oy}))/((${s0})+(${ds})*(${zvar}-(${var0}))/(${dvar})))`)
            var xmin = limits[0][0]
            var xmax = limits[0][1]
            var zmin = limits[2][0]
            var zmax = limits[2][1]
            var x00 = ox+(xmin-ox)*(s0+ds*(zmin-var0)/dvar)
            var x01 = ox+(xmin-ox)*(s0+ds*(zmax-var0)/dvar)
            limits[0][0] = Math.min(x00,x01)
            var x10 = ox+(xmax-ox)*(s0+ds*(zmin-var0)/dvar)
            var x11 = ox+(xmax-ox)*(s0+ds*(zmax-var0)/dvar)
            limits[0][1] = Math.max(x10,x11)
            var ymin = limits[1][0]
            var ymax = limits[1][1]
            var y00 = oy+(ymin-oy)*(s0+ds*(zmin-var0)/dvar)
            var y01 = oy+(ymin-oy)*(s0+ds*(zmax-var0)/dvar)
            limits[1][0] = Math.min(y00,y01)
            var y10 = oy+(ymax-oy)*(s0+ds*(zmin-var0)/dvar)
            var y11 = oy+(ymax-oy)*(s0+ds*(zmax-var0)/dvar)
            limits[1][1] = Math.max(y10,y11)
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
   // direction 
   //
   div.appendChild(document.createTextNode('direction: '))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('x(y)'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      div.appendChild(input)
      mod.xy = input
   div.appendChild(document.createTextNode(' x(z)'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      div.appendChild(input)
      mod.xz = input
   div.appendChild(document.createTextNode(' y(z)'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      div.appendChild(input)
      mod.yz = input
   div.appendChild(document.createTextNode(' xy(z)'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      div.appendChild(input)
      mod.xyz = input
   div.appendChild(document.createElement('br'))
   //
   // variable 0
   //
   div.appendChild(document.createTextNode('at: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.variable0 = input
   //
   // scale 0
   //
   div.appendChild(document.createTextNode(' scale by: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.scale0 = input
   div.appendChild(document.createElement('br'))
   //
   // variable 1
   //
   div.appendChild(document.createTextNode('at: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.variable1 = input
   //
   // scale 1
   //
   div.appendChild(document.createTextNode(' scale by: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.scale1 = input
   div.appendChild(document.createElement('br'))
   //
   // x origin
   //
   div.appendChild(document.createTextNode('origin x: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.originx = input
   //
   // y origin
   //
   div.appendChild(document.createTextNode(' y: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.originy = input
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

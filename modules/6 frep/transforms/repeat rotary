//
// frep repeat rotary
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
var name = 'frep repeat rotary'
//
// initialization
//
var init = function() {
   mod.ox.value = 0
   mod.oy.value = 0
   mod.angle.value = 45
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
         var ox = parseFloat(mod.ox.value)
         var oy = parseFloat(mod.oy.value)
         var angle = Math.PI*parseFloat(mod.angle.value)/180
         var limits = []
         for (var v = 0; v < mod.shape.limits.length; ++v) {
            limits[v] = []
            limits[v][0] = mod.shape.limits[v][0]
            limits[v][1] = mod.shape.limits[v][1]
            }
         var xvar = variables[0]
         var yvar = variables[1]
         var xmin = limits[0][0]
         var xmax = limits[0][1]
         var ymin = limits[1][0]
         var ymax = limits[1][1]
         var xre = new RegExp(xvar,'g')
         var yre = new RegExp(yvar,'g')
         var tmin = Math.atan2(ymin-oy,xmin-ox)
         var tmax = Math.atan2(ymax-oy,xmin-ox)
         var dt = tmax-tmin
         fn = fn.replace(xre,`((${ox})+Math.sqrt((${xvar}-(${ox}))*(${xvar}-(${ox}))+(TEMP-(${oy}))*(TEMP-(${oy})))*Math.cos((${tmin})+(2*Math.PI+Math.atan2(TEMP-(${oy}),${xvar}-(${ox}))-(${tmin}))%(${angle})))`)
         fn = fn.replace(yre,`((${oy})+Math.sqrt((${xvar}-(${ox}))*(${xvar}-(${ox}))+(TEMP-(${oy}))*(TEMP-(${oy})))*Math.sin((${tmin})+(2*Math.PI+Math.atan2(TEMP-(${oy}),${xvar}-(${ox}))-(${tmin}))%(${angle})))`)
         fn = fn.replace(/TEMP/g,yvar)
         var r00 = Math.sqrt((xmin-ox)*(xmin-ox)+(ymin-oy)*(ymin-oy))
         var r01 = Math.sqrt((xmin-ox)*(xmin-ox)+(ymax-oy)*(ymax-oy))
         var r10 = Math.sqrt((xmax-ox)*(xmax-ox)+(ymin-oy)*(ymin-oy))
         var r11 = Math.sqrt((xmax-ox)*(xmax-ox)+(ymax-oy)*(ymax-oy))
         var rmax = Math.max(r00,r01,r10,r11)
         limits[0][0] = ox-rmax
         limits[0][1] = ox+rmax
         limits[1][0] = oy-rmax
         limits[1][1] = oy+rmax
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
   div.appendChild(document.createTextNode('x origin: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.ox = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('y origin: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.oy = input
   div.appendChild(document.createElement('br'))
   //
   // angle 
   //
   div.appendChild(document.createTextNode('angle: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.angle = input
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

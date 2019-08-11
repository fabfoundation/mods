//
// frep rotate
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
var name = 'frep rotate'
//
// initialization
//
var init = function() {
   mod.rx.value = ''
   mod.ry.value = ''
   mod.rz.value = 45
   mod.ox.value = 0
   mod.oy.value = 0
   mod.oz.value = 0
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
         var ox = parseFloat(mod.ox.value)
         var oy = parseFloat(mod.oy.value)
         var oz = parseFloat(mod.oz.value)
         if (mod.rx.value != '') {
            var rx = parseFloat(mod.rx.value)*Math.PI/180
            var yvar = variables[1]
            var zvar = variables[2]
            var yre = new RegExp(yvar,'g')
            var zre = new RegExp(zvar,'g')
            fn = fn.replace(yre,
               `((${oy})+(${yvar}-(${oy}))*Math.cos(${rx})+(TEMP-(${oz}))*Math.sin(${rx}))`)
            fn = fn.replace(zre,
               `((${oz})-(${yvar}-(${oy}))*Math.sin(${rx})+(${zvar}-(${oz}))*Math.cos(${rx}))`)
            fn = fn.replace(/TEMP/g,zvar)
            var y0 = limits[1][0]
            var y1 = limits[1][1]
            var z0 = limits[2][0]
            var z1 = limits[2][1]
            limits[1][0] = Math.min(
               oy+(y0-oy)*Math.cos(rx)-(z0-oz)*Math.sin(rx),
               oy+(y0-oy)*Math.cos(rx)-(z1-oz)*Math.sin(rx),
               oy+(y1-oy)*Math.cos(rx)-(z0-oz)*Math.sin(rx),
               oy+(y1-oy)*Math.cos(rx)-(z1-oz)*Math.sin(rx))
            limits[1][1] = Math.max(
               oy+(y0-oy)*Math.cos(rx)-(z0-oz)*Math.sin(rx),
               oy+(y0-oy)*Math.cos(rx)-(z1-oz)*Math.sin(rx),
               oy+(y1-oy)*Math.cos(rx)-(z0-oz)*Math.sin(rx),
               oy+(y1-oy)*Math.cos(rx)-(z1-oz)*Math.sin(rx))
            limits[2][0] = Math.min(
               oz+(y0-oy)*Math.sin(rx)+(z0-oz)*Math.cos(rx),
               oz+(y0-oy)*Math.sin(rx)+(z1-oz)*Math.cos(rx),
               oz+(y1-oy)*Math.sin(rx)+(z0-oz)*Math.cos(rx),
               oz+(y1-oy)*Math.sin(rx)+(z1-oz)*Math.cos(rx))
            limits[2][1] = Math.max(
               oz+(y0-oy)*Math.sin(rx)+(z0-oz)*Math.cos(rx),
               oz+(y0-oy)*Math.sin(rx)+(z1-oz)*Math.cos(rx),
               oz+(y1-oy)*Math.sin(rx)+(z0-oz)*Math.cos(rx),
               oz+(y1-oy)*Math.sin(rx)+(z1-oz)*Math.cos(rx))
            }
         if (mod.ry.value != '') {
            var ry = parseFloat(mod.ry.value)*Math.PI/180
            var xvar = variables[0]
            var zvar = variables[2]
            var xre = new RegExp(xvar,'g')
            var zre = new RegExp(zvar,'g')
            fn = fn.replace(xre,
               `((${ox})+(${xvar}-(${ox}))*Math.cos(${ry})+(TEMP-(${oz}))*Math.sin(${ry}))`)
            fn = fn.replace(zre,
               `((${oz})-(${xvar}-(${ox}))*Math.sin(${ry})+(${zvar}-(${oz}))*Math.cos(${ry}))`)
            fn = fn.replace(/TEMP/g,zvar)
            var x0 = limits[0][0]
            var x1 = limits[0][1]
            var z0 = limits[2][0]
            var z1 = limits[2][1]
            limits[0][0] = Math.min(
               ox+(x0-ox)*Math.cos(ry)-(z0-oz)*Math.sin(ry),
               ox+(x0-ox)*Math.cos(ry)-(z1-oz)*Math.sin(ry),
               ox+(x1-ox)*Math.cos(ry)-(z0-oz)*Math.sin(ry),
               ox+(x1-ox)*Math.cos(ry)-(z1-oz)*Math.sin(ry))
            limits[0][1] = Math.max(
               ox+(x0-ox)*Math.cos(ry)-(z0-oz)*Math.sin(ry),
               ox+(x0-ox)*Math.cos(ry)-(z1-oz)*Math.sin(ry),
               ox+(x1-ox)*Math.cos(ry)-(z0-oz)*Math.sin(ry),
               ox+(x1-ox)*Math.cos(ry)-(z1-oz)*Math.sin(ry))
            limits[2][0] = Math.min(
               oz+(x0-ox)*Math.sin(ry)+(z0-oz)*Math.cos(ry),
               oz+(x0-ox)*Math.sin(ry)+(z1-oz)*Math.cos(ry),
               oz+(x1-ox)*Math.sin(ry)+(z0-oz)*Math.cos(ry),
               oz+(x1-ox)*Math.sin(ry)+(z1-oz)*Math.cos(ry))
            limits[2][1] = Math.max(
               oz+(x0-ox)*Math.sin(ry)+(z0-oz)*Math.cos(ry),
               oz+(x0-ox)*Math.sin(ry)+(z1-oz)*Math.cos(ry),
               oz+(x1-ox)*Math.sin(ry)+(z0-oz)*Math.cos(ry),
               oz+(x1-ox)*Math.sin(ry)+(z1-oz)*Math.cos(ry))
            }
         if (mod.rz.value != '') {
            var rz = parseFloat(mod.rz.value)*Math.PI/180
            var xvar = variables[0]
            var yvar = variables[1]
            var xre = new RegExp(xvar,'g')
            var yre = new RegExp(yvar,'g')
            fn = fn.replace(xre,
               `((${ox})+(${xvar}-(${ox}))*Math.cos(${rz})+(TEMP-(${oy}))*Math.sin(${rz}))`)
            fn = fn.replace(yre,
               `((${oy})-(${xvar}-(${ox}))*Math.sin(${rz})+(${yvar}-(${oy}))*Math.cos(${rz}))`)
            fn = fn.replace(/TEMP/g,yvar)
            var x0 = limits[0][0]
            var x1 = limits[0][1]
            var y0 = limits[1][0]
            var y1 = limits[1][1]
            limits[0][0] = Math.min(
               ox+(x0-ox)*Math.cos(rz)-(y0-oy)*Math.sin(rz),
               ox+(x0-ox)*Math.cos(rz)-(y1-oy)*Math.sin(rz),
               ox+(x1-ox)*Math.cos(rz)-(y0-oy)*Math.sin(rz),
               ox+(x1-ox)*Math.cos(rz)-(y1-oy)*Math.sin(rz))
            limits[0][1] = Math.max(
               ox+(x0-ox)*Math.cos(rz)-(y0-oy)*Math.sin(rz),
               ox+(x0-ox)*Math.cos(rz)-(y1-oy)*Math.sin(rz),
               ox+(x1-ox)*Math.cos(rz)-(y0-oy)*Math.sin(rz),
               ox+(x1-ox)*Math.cos(rz)-(y1-oy)*Math.sin(rz))
            limits[1][0] = Math.min(
               oy+(x0-ox)*Math.sin(rz)+(y0-oy)*Math.cos(rz),
               oy+(x0-ox)*Math.sin(rz)+(y1-oy)*Math.cos(rz),
               oy+(x1-ox)*Math.sin(rz)+(y0-oy)*Math.cos(rz),
               oy+(x1-ox)*Math.sin(rz)+(y1-oy)*Math.cos(rz))
            limits[1][1] = Math.max(
               oy+(x0-ox)*Math.sin(rz)+(y0-oy)*Math.cos(rz),
               oy+(x0-ox)*Math.sin(rz)+(y1-oy)*Math.cos(rz),
               oy+(x1-ox)*Math.sin(rz)+(y0-oy)*Math.cos(rz),
               oy+(x1-ox)*Math.sin(rz)+(y1-oy)*Math.cos(rz))
            }
         var shape = {function:fn,variables:variables,limits:limits,type:type}
         mods.output(mod,'shape',shape)}
         }}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('angle\xa0\xa0\xa0 origin'))
   div.appendChild(document.createElement('br'))
   //
   // x
   //
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.rx = input
   div.appendChild(document.createTextNode(' x '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.ox = input
   div.appendChild(document.createElement('br'))
   //
   // y
   //
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.ry = input
   div.appendChild(document.createTextNode(' y '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.oy = input
   div.appendChild(document.createElement('br'))
   //
   // z
   //
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.rz = input
   div.appendChild(document.createTextNode(' z '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.oz = input
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

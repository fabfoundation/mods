//
// frep translate
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
var name = 'frep translate'
//
// initialization
//
var init = function() {
   mod.dx.value = 1
   mod.dy.value = 1
   mod.dz.value = ''
   mod.xmin.value = ''
   mod.ymin.value = ''
   mod.zmin.value = ''
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
         if (mod.xmin.value != '') {
            var xmin = parseFloat(mod.xmin.value)
            var xvar = variables[0]
            var re = new RegExp(xvar,'g')
            fn = fn.replace(re,`((${limits[0][0]})+${xvar}-(${xmin}))`)
            var dx = limits[0][1]-limits[0][0]
            limits[0][0] = xmin
            limits[0][1] = xmin+dx
            }
         else if (mod.dx.value != '') {
            var dx = parseFloat(mod.dx.value)
            var xvar = variables[0]
            var re = new RegExp(xvar,'g')
            fn = fn.replace(re,`(${xvar}-(${dx}))`)
            var dx = parseFloat(mod.dx.value)
            limits[0][0] += dx
            limits[0][1] += dx
            }
         if (mod.ymin.value != '') {
            var ymin = parseFloat(mod.ymin.value)
            var yvar = variables[1]
            var re = new RegExp(yvar,'g')
            fn = fn.replace(re,`((${limits[1][0]})+${yvar}-(${ymin}))`)
            var dy = limits[1][1]-limits[1][0]
            limits[1][0] = ymin
            limits[1][1] = ymin+dy
            }
         else if (mod.dy.value != '') {
            var dy = parseFloat(mod.dy.value)
            var yvar = variables[1]
            var re = new RegExp(yvar,'g')
            fn = fn.replace(re,`(${yvar}-(${dy}))`)
            var dy = parseFloat(mod.dy.value)
            limits[1][0] += dy
            limits[1][1] += dy
            }
         if (mod.zmin.value != '') {
            var zmin = parseFloat(mod.zmin.value)
            var zvar = variables[2]
            var re = new RegExp(zvar,'g')
            fn = fn.replace(re,`((${limits[2][0]})+${zvar}-(${zmin}))`)
            var dz = limits[2][1]-limits[2][0]
            limits[2][0] = zmin
            limits[2][1] = zmin+dz
            }
         else if (mod.dz.value != '') {
            var dz = parseFloat(mod.dz.value)
            var zvar = variables[2]
            var re = new RegExp(zvar,'g')
            fn = fn.replace(re,`(${zvar}-(${dz}))`)
            var dz = parseFloat(mod.dz.value)
            limits[2][0] += dz
            limits[2][1] += dz
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
   // x
   //
   div.appendChild(document.createTextNode('xmin: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         mod.dx.value = ''
         })
      div.appendChild(input)
      mod.xmin = input
   div.appendChild(document.createTextNode(' dx: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         mod.xmin.value = ''
         })
      div.appendChild(input)
      mod.dx = input
   div.appendChild(document.createElement('br'))
   //
   // y
   //
   div.appendChild(document.createTextNode('ymin: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         mod.dy.value = ''
         })
      div.appendChild(input)
      mod.ymin = input
   div.appendChild(document.createTextNode(' dy: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         mod.ymin.value = ''
         })
      div.appendChild(input)
      mod.dy = input
   div.appendChild(document.createElement('br'))
   //
   // z
   //
   div.appendChild(document.createTextNode('zmin: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         mod.dz.value = ''
         })
      div.appendChild(input)
      mod.zmin = input
   div.appendChild(document.createTextNode(' dz: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         mod.zmin.value = ''
         })
      div.appendChild(input)
      mod.dz = input
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

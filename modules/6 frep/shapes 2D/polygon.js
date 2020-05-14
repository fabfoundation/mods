//
// frep polygon 
//    todo: tight bounding box calculation
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
var name = 'frep polygon'
//
// initialization
//
var init = function() {
   mod.x.value = '0'
   mod.y.value = '0'
   mod.sides.value = '5'
   mod.radius.value = '1'
   }
//
// inputs
//
var inputs = {
   variables:{type:'',
      event:function(evt){
         for (var p in evt.detail)
            mod[p].value = evt.detail[p]
         outputs.variables.event()
         outputs.shape.event()
         }}}
//
// outputs
//
var outputs = {
   shape:{type:'',
      event:function(){
         var x = parseFloat(mod.x.value)
         var y = parseFloat(mod.y.value)
         var sides = parseInt(mod.sides.value)
         var radius = parseFloat(mod.radius.value)
         var fn = `((${radius})-(X-(${x})))`
         for (var s = 1; s < sides; ++s) {
            var nx = Math.cos(s*2*Math.PI/sides)
            var ny = Math.sin(s*2*Math.PI/sides)
            var fn = `Math.min((${radius})-((X-(${x}))*(${nx})+(Y-(${y}))*(${ny})),${fn})`
            }
         var variables = ['X','Y']
         var limits = [[x-2*radius,x+2*radius],[y-2*radius,y+2*radius]]
         var type = 'Magnitude'
         var shape = {function:fn,variables:variables,limits:limits,type:type}
         mods.output(mod,'shape',shape)}
         },
   variables:{type:'',
      event:function(){
         var x = parseFloat(mod.x.value)
         var y = parseFloat(mod.y.value)
         var sides = parseFloat(mod.sides.value)
         var radius = parseFloat(mod.radius.value)
         var vars = {x:x,y:y,sides:sides,radius:radius}
         mods.output(mod,'variables',vars)}
         }}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // x
   //
   div.appendChild(document.createTextNode('x: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.x = input
   //
   // y
   //
   div.appendChild(document.createTextNode(' y: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.y = input
   div.appendChild(document.createElement('br'))
   //
   // sides
   //
   div.appendChild(document.createTextNode('sides: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.sides = input
   div.appendChild(document.createElement('br'))
   //
   // radius
   //
   div.appendChild(document.createTextNode('radius: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.radius = input
   div.appendChild(document.createElement('br'))
   //
   // output button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('output'))
      btn.addEventListener('click',function(){
         outputs.variables.event()
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

//
// frep pyramid
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
var name = 'frep pyramid'
//
// initialization
//
var init = function() {
   mod.x.checked = false
   mod.y.checked = false
   mod.z.checked = true
   mod.x0.value = '0'
   mod.x1.value = '1'
   mod.y0.value = '0'
   mod.y1.value = '1'
   mod.z0.value = '0'
   mod.z1.value = '1'
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
         var x0 = parseFloat(mod.x0.value)
         var x1 = parseFloat(mod.x1.value)
         var y0 = parseFloat(mod.y0.value)
         var y1 = parseFloat(mod.y1.value)
         var z0 = parseFloat(mod.z0.value)
         var z1 = parseFloat(mod.z1.value)
         if (mod.x.checked) {
            var fny0 = `Y-(${y0})-((X-(${x0}))/((${x1})-(${x0})))*((${y1})-(${y0}))/2`
            var fnz0 = `Z-(${z0})-((X-(${x0}))/((${x1})-(${x0})))*((${z1})-(${z0}))/2`
            var fny1 = `(${y1})-Y-((X-(${x0}))/((${x1})-(${x0})))*((${y1})-(${y0}))/2`
            var fnz1 = `(${z1})-Z-((X-(${x0}))/((${x1})-(${x0})))*((${z1})-(${z0}))/2`
            var fn = `Math.min(${fny0},${fny1})`
            fn = `Math.min(${fnz0},${fn})`
            fn = `Math.min(${fnz1},${fn})`
            fn = `Math.min(X-(${x0}),${fn})`
            fn = `Math.min((${x1})-X,${fn})`
            }
         else if (mod.y.checked) {
            var fnx0 = `X-(${x0})-((Y-(${y0}))/((${y1})-(${y0})))*((${x1})-(${x0}))/2`
            var fnz0 = `Z-(${z0})-((Y-(${y0}))/((${y1})-(${y0})))*((${z1})-(${z0}))/2`
            var fnx1 = `(${x1})-X-((Y-(${y0}))/((${y1})-(${y0})))*((${x1})-(${x0}))/2`
            var fnz1 = `(${z1})-Z-((Y-(${y0}))/((${y1})-(${y0})))*((${z1})-(${z0}))/2`
            var fn = `Math.min(${fnx0},${fnx1})`
            fn = `Math.min(${fnz0},${fn})`
            fn = `Math.min(${fnz1},${fn})`
            fn = `Math.min(Y-(${y0}),${fn})`
            fn = `Math.min((${y1})-Y,${fn})`
            }
         else if (mod.z.checked) {
            var fnx0 = `X-(${x0})-((Z-(${z0}))/((${z1})-(${z0})))*((${x1})-(${x0}))/2`
            var fny0 = `Y-(${y0})-((Z-(${z0}))/((${z1})-(${z0})))*((${y1})-(${y0}))/2`
            var fnx1 = `(${x1})-X-((Z-(${z0}))/((${z1})-(${z0})))*((${x1})-(${x0}))/2`
            var fny1 = `(${y1})-Y-((Z-(${z0}))/((${z1})-(${z0})))*((${y1})-(${y0}))/2`
            var fn = `Math.min(${fnx0},${fnx1})`
            fn = `Math.min(${fny0},${fn})`
            fn = `Math.min(${fny1},${fn})`
            fn = `Math.min(Z-(${z0}),${fn})`
            fn = `Math.min((${z1})-Z,${fn})`
            }
         var variables = ['X','Y','Z']
         var limits = [[x0,x1],[y0,y1],[z0,z1]]
         var type = 'Magnitude'
         var shape = {function:fn,variables:variables,limits:limits,type:type}
         mods.output(mod,'shape',shape)}
         },
   variables:{type:'',
      event:function(){
         var x0 = parseFloat(mod.x0.value)
         var x1 = parseFloat(mod.x1.value)
         var y0 = parseFloat(mod.y0.value)
         var y1 = parseFloat(mod.y1.value)
         var z0 = parseFloat(mod.z0.value)
         var z1 = parseFloat(mod.z1.value)
         var vars = {x0:x0,x1:x1,y0:y0,y1:y1,z0:z0,z1:z1}
         mods.output(mod,'variables',vars)}
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
   div.appendChild(document.createTextNode('x'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      div.appendChild(input)
      mod.x = input
   div.appendChild(document.createTextNode('y'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      div.appendChild(input)
      mod.y = input
   div.appendChild(document.createTextNode('z'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'axis'
      div.appendChild(input)
      mod.z = input
   div.appendChild(document.createElement('br'))
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

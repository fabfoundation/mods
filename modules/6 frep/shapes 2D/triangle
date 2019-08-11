//
// frep triangle
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
var name = 'frep triangle'
//
// initialization
//
var init = function() {
   mod.x0.value = '0'
   mod.y0.value = '0'
   mod.x1.value = '2'
   mod.y1.value = '1'
   mod.x2.value = '1'
   mod.y2.value = '2'
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
         var y0 = parseFloat(mod.y0.value)
         var x1 = parseFloat(mod.x1.value)
         var y1 = parseFloat(mod.y1.value)
         var x2 = parseFloat(mod.x2.value)
         var y2 = parseFloat(mod.y2.value)
         var fn = `(${x1-x0})*(Y-(${y0}))-(${y1-y0})*(X-(${x0}))`
         var fn = `Math.min(${fn},(${x2-x1})*(Y-(${y1}))-(${y2-y1})*(X-(${x1})))`
         var fn = `Math.min(${fn},(${x0-x2})*(Y-(${y2}))-(${y0-y2})*(X-(${x2})))`
         var variables = ['X','Y']
         var limits = [[Math.min(x0,x1,x2),Math.max(x0,x1,x2)],
            [Math.min(y0,y1,y2),Math.max(y0,y1,y2)]]
         var type = 'Magnitude'
         var shape = {function:fn,variables:variables,limits:limits,type:type}
         mods.output(mod,'shape',shape)}
         },
   variables:{type:'',
      event:function(){
         var x0 = parseFloat(mod.x0.value)
         var y0 = parseFloat(mod.y0.value)
         var x1 = parseFloat(mod.x1.value)
         var y1 = parseFloat(mod.y1.value)
         var x2 = parseFloat(mod.x2.value)
         var y2 = parseFloat(mod.y2.value)
         var vars = {x0:x0,y0:y0,x1:x1,y1:y1,x2:x2,y2:y2}
         mods.output(mod,'variables',vars)}
         }}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('counter-clockwise:'))
   div.appendChild(document.createElement('br'))
   //
   // 0
   //
   div.appendChild(document.createTextNode('x0: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.x0 = input
   div.appendChild(document.createTextNode(' y0: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.y0 = input
   div.appendChild(document.createElement('br'))
   //
   // 1
   //
   div.appendChild(document.createTextNode('x1: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.x1 = input
   div.appendChild(document.createTextNode(' y1: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.y1 = input
   div.appendChild(document.createElement('br'))
   //
   // 2
   //
   div.appendChild(document.createTextNode('x2: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.x2 = input
   div.appendChild(document.createTextNode(' y2: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.y2 = input
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


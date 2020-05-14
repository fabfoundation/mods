//
// frep cylinder
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
var name = 'frep cylinder'
//
// initialization
//
var init = function() {
   mod.x.checked = false
   mod.y.checked = false
   mod.z.checked = true
   mod.ox.value = '0'
   mod.oy.value = '0'
   mod.oz.value = '0'
   mod.length.value = '2'
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
         var ox = parseFloat(mod.ox.value)
         var oy = parseFloat(mod.oy.value)
         var oz = parseFloat(mod.oy.value)
         var length = parseFloat(mod.length.value)
         var r = parseFloat(mod.radius.value)
         if (mod.x.checked) {
            var fn = `(${r}*${r}-((Y-(${oy}))*(Y-(${oy}))+(Z-(${oz}))*(Z-(${oz}))))`
            fn = `Math.min((X-(${ox})),(${fn}))`
            fn = `Math.min(((${ox+length})-X),(${fn}))`
            var variables = ['X','Y','Z']
            var limits = [[ox,ox+length],[oy-r,oy+r],[oz-r,oz+r]]
            }
         else if (mod.y.checked) {
            var fn = `(${r}*${r}-((X-(${ox}))*(X-(${ox}))+(Z-(${oz}))*(Z-(${oz}))))`
            fn = `Math.min((Y-(${oy})),(${fn}))`
            fn = `Math.min(((${oy+length})-Y),(${fn}))`
            var variables = ['X','Y','Z']
            var limits = [[ox-r,ox+r],[oy,oy+length],[oz-r,oz+r]]
            }
         else if (mod.z.checked) {
            var fn = `(${r}*${r}-((X-(${ox}))*(X-(${ox}))+(Y-(${oy}))*(Y-(${oy}))))`
            fn = `Math.min((Z-(${oz})),(${fn}))`
            fn = `Math.min(((${oz+length})-Z),(${fn}))`
            var variables = ['X','Y','Z']
            var limits = [[ox-r,ox+r],[oy-r,oy+r],[oz,oz+length]]
            }
         var type = 'Magnitude'
         var shape = {function:fn,variables:variables,limits:limits,type:type}
         mods.output(mod,'shape',shape)}
         },
   variables:{type:'',
      event:function(){
         var ox = parseFloat(mod.ox.value)
         var oy = parseFloat(mod.oy.value)
         var oz = parseFloat(mod.oz.value)
         var length = parseFloat(mod.length.value)
         var radius = parseFloat(mod.radius.value)
         var vars = {ox:ox,oy:oy,oz:oz,length:length,radius:radius}
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
   // origin
   //
   div.appendChild(document.createTextNode('origin:'))
   div.appendChild(document.createElement('br'))
   //
   // x
   //
   div.appendChild(document.createTextNode('x: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.ox = input
   //
   // y
   //
   div.appendChild(document.createTextNode(' y: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.oy = input
   div.appendChild(document.createElement('br'))
   //
   // z
   //
   div.appendChild(document.createTextNode('z: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.oz = input
   div.appendChild(document.createElement('br'))
   //
   // length
   //
   div.appendChild(document.createTextNode('length: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.length = input
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
